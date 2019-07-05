import React, { PureComponent } from 'react';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import { filter } from 'lodash';
import { shouldUpdate } from 'recompose';

import { FriendList, FriendsTabBarLabel } from '~components';

const userFriendsQuery = gql`
  query MyFriendsQuery {
    me {
      id
      friends(filter: {
        friendshipPhaseIn: [ REQUEST_RECEIVED, REQUEST_SENT, ACTIVE ]
      }) {
        edges {
          ...FriendList_edge
        }
      }

      ...FriendsTabBarLabel_user
    }
  }
  
  ${FriendsTabBarLabel.fragments.user}
  ${FriendList.fragments.edge}
`;

const addFriendSubscription = gql`
  subscription MyFriendsAddSubscription($userId: ID!) {
    onFriendshipAdd(userId: $userId) {
      edge {
        ...FriendList_edge
      }
    }
  }

  ${FriendList.fragments.edge}
`;

const deleteFriendSubscription = gql`
  subscription MyFriendsDeleteSubscription($userId: ID!) {
    onFriendshipDelete(userId: $userId) {
      deletedId
    }
  }
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($input: AddFriendInput!) {
    result: addFriend(input: $input) {
      user {
        id
        ...FriendsTabBarLabel_user
      }
      friendship {
        id
        status
      }
    }
  }

  ${FriendsTabBarLabel.fragments.user}
`;

const deleteFriendMutation = gql`
  mutation DeleteFriendMutation($input: DeleteFriendInput!) {
    result: deleteFriend(input: $input) {
      user {
        id
        ...FriendsTabBarLabel_user
      }
      deletedId
    }
  }

  ${FriendsTabBarLabel.fragments.user}
`;

const createAddFriendOptimistic = (user, { friendship, status, requests }) => ({
  result: {
    __typename: 'AddFriendPayload',
    user: FriendsTabBarLabel.createOptimisticUser(user, { requests }),
    friendship: {
      ...friendship,
      status,
    },
  },
});

const removeFromList = (data, toDeleteId) => update(data, {
  me: {
    friends: {
      edges: {
        $set: filter(data.me.friends.edges, ({ friendship: { id } }) => (
          toDeleteId !== id
        )),
      },
    },
  },
});

const removeFromCache = (cache, toDeleteId) => {
  const data = cache.readQuery({ query: userFriendsQuery });
  cache.writeQuery({ query: userFriendsQuery, data: removeFromList(data, toDeleteId) });
};

@graphql(userFriendsQuery, {
  skip: props => !!props.skip,
})
@graphql(addFriendMutation, {
  name: 'addFriend',
})
@graphql(deleteFriendMutation, {
  name: 'deleteFriend',
})
@withNavigation
@withNavigationFocus
@shouldUpdate((props, nextProps) => nextProps.isFocused)
export default class MyFriendsConnection extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    skip: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    skip: false,
  };

  unsubscribeFromFocus = null;
  state = {
    isRefreshing: false,
  };

  /**
   * TODO: Move these common logic to a central place, to prevent copy & past
   */
  refresh = async () => {
    const { data: { refetch } } = this.props;

    this.setState({ isRefreshing: true });
    try {
      await refetch({ cursor: null });
    } catch {
      // Pass...
    }
    this.setState({ isRefreshing: false });
  };

  onAcceptPress = async ({ node, friendship }) => {
    const { addFriend, data: { me } } = this.props;
    const status = 'ACTIVE';
    const input = {
      userId: me.id,
      friendId: node.id,
      status,
    };

    addFriend({
      variables: { input },
      optimisticResponse: createAddFriendOptimistic(me, {
        friendship,
        status,
        requests: -1,
      }),
    });
  };

  onIgnorePress = async ({ node, friendship }) => {
    const { addFriend, data: { me } } = this.props;
    const status = 'IGNORED';
    const input = {
      userId: me.id,
      friendId: node.id,
      status,
    };

    addFriend({
      variables: { input },
      optimisticResponse: createAddFriendOptimistic(me, {
        friendship,
        status,
        requests: -1,
      }),
      update: (cache, { data }) => removeFromCache(cache, data.result.friendship.id),
    });
  };

  onCancelPress = async ({ node, friendship }) => {
    const { deleteFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: node.id,
    };

    deleteFriend({
      variables: { input },
      optimisticResponse: {
        result: {
          __typename: 'DeleteFriendPayload',
          user: FriendsTabBarLabel.createOptimisticUser(me),
          deletedId: friendship.id,
        },
      },

      update: (cache, { data }) => removeFromCache(cache, data.result.deletedId),
    });
  };

  /**
   * TODO: It might be better to use Subscriptions to update the counter. Think about it later
   * TODO: Try to move this logic somewhere to be able to reuse it
   */
  componentDidMount() {
    const { navigation, data } = this.props;

    this.unsubscribeFromFocus = navigation.addListener('willFocus', () => {
      if (data) data.refetch();
    });
  }

  componentDidUpdate({ data: prevData }) {
    const { data } = this.props;

    if (data.me?.id && !prevData.me?.id) {
      this.startSubscriptions(data.me.id);
    }
  }

  startSubscriptions(userId) {
    const variables = { userId };

    this.props.data.subscribeToMore({
      document: addFriendSubscription,
      variables,
      updateQuery: (prev, { subscriptionData }) => {
        const { onFriendshipAdd: payload } = subscriptionData.data;

        return update(prev, {
          me: {
            friends: {
              edges: {
                $unshift: [payload.edge],
              },
            },
          },
        });
      },
    });

    this.props.data.subscribeToMore({
      document: deleteFriendSubscription,
      variables,
      updateQuery: (prev, { subscriptionData }) => {
        const { onFriendshipDelete: { deletedId } } = subscriptionData.data;

        return removeFromList(prev, deletedId);
      },
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromFocus.remove();
  }

  render() {
    const { data: { loading, me }, skip, ...props } = this.props;
    const { isRefreshing } = this.state;

    return (
      <FriendList
        {...props}
        edges={me?.friends.edges}
        loading={loading}
        refreshing={isRefreshing}
        noContentText="No friends"
        onRefresh={this.refresh}
        onAcceptPress={this.onAcceptPress}
        onIgnorePress={this.onIgnorePress}
        onCancelPress={this.onCancelPress}
      />
    );
  }
}