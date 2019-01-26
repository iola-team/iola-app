import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get, filter } from 'lodash';

import { FriendList } from 'components';
import TabBarLabel from './TabBarLabel';

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

      ...MyFriendsTabBarLabel
    }
  }
  
  ${TabBarLabel.fragments.user}
  ${FriendList.fragments.edge}
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($input: AddFriendInput!) {
    result: addFriend(input: $input) {
      user {
        id
        ...MyFriendsTabBarLabel
      }
      friendship {
        id
        status
      }
    }
  }

  ${TabBarLabel.fragments.user}
`;


const deleteFriendMutation = gql`
  mutation DeleteFriendMutation($input: DeleteFriendInput!) {
    result: deleteFriend(input: $input) {
      user {
        id
        ...MyFriendsTabBarLabel
      }
      deletedId
    }
  }

  ${TabBarLabel.fragments.user}
`;

const createAddFriendOptimistic = (user, { friendship, status, friends, requests }) => ({
  result: {
    __typename: 'AddFriendPayload',
    user: TabBarLabel.createOptimisticUser(user, { friends, requests }),
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
export default class MyFriendsConnection extends Component {
  static propTypes = {
    data: PropTypes.object,
    skip: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    skip: false,
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
        friends: +1,
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
          user: TabBarLabel.createOptimisticUser(me, { requests: -1 }),
          deletedId: friendship.id,
        },
      },

      update: (cache, { data }) => removeFromCache(cache, data.result.deletedId),
    });
  };

  render() {
    const { data: { loading, me }, skip, ...props } = this.props;
    const edges = get(me, 'friends.edges', []);

    return (
      <FriendList
        {...props}
        edges={edges}
        loading={skip || loading}
        noContentText="No friends"

        onAcceptPress={this.onAcceptPress}
        onIgnorePress={this.onIgnorePress}
        onCancelPress={this.onCancelPress}
      />
    );
  }
}