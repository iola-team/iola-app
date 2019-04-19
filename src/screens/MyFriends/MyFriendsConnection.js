import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get, filter } from 'lodash';

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

const removeFromCache = (cache, toDeleteId) => {
  const data = cache.readQuery({ query: userFriendsQuery });

  /**
   * Remove friendship from cache
   */
  data.me.friends.edges = filter(data.me.friends.edges, ({ friendship: { id } }) => (
    toDeleteId !== id
  ));

  cache.writeQuery({ query: userFriendsQuery, data });
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
          user: FriendsTabBarLabel.createOptimisticUser(me, { requests: -1 }),
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

  componentWillUnmount() {
    this.unsubscribeFromFocus.remove();
  }

  render() {
    const { data: { loading, me }, skip, ...props } = this.props;
    const { isRefreshing } = this.state;
    const edges = get(me, 'friends.edges', []);

    return (
      <FriendList
        {...props}
        edges={edges}
        loading={skip || loading}
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