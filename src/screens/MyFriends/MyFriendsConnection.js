import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get, filter } from 'lodash';

import { FriendList } from 'components';

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
    }
  }
  
  ${FriendList.fragments.edge}
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($input: AddFriendInput!) {
    result: addFriend(input: $input) {
      friendship {
        id
        status
      }
    }
  }
`;


const deleteFriendMutation = gql`
  mutation DeleteFriendMutation($input: DeleteFriendInput!) {
    result: deleteFriend(input: $input) {
      deletedId
    }
  }
`;

const createAddFriendOptimistic = (friendship, status) => ({
  result: {
    __typename: 'AddFriendPayload',
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
    const input = {
      userId: me.id,
      friendId: node.id,
      status: 'ACTIVE',
    };

    addFriend({
      variables: { input },
      optimisticResponse: createAddFriendOptimistic(friendship, 'ACTIVE'),
    });
  };

  onIgnorePress = async ({ node, friendship }) => {
    const { addFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: node.id,
      status: 'IGNORED',
    };

    addFriend({
      variables: { input },
      optimisticResponse: createAddFriendOptimistic(friendship, 'IGNORED'),
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