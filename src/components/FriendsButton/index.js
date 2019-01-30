import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

import FriendsButton from './FriendsButton';

const userQuery = gql`
  query FriendsButtonQuery($userId: ID!) {
    me {
      id
      friends(filter: {
        friendIdIn: [$userId]
        friendshipPhaseIn: [ACTIVE, REQUEST_SENT, REQUEST_RECEIVED]
      }) {
        edges {
          ...FriendsButton_edge
        }
      }
    }
  }
  
  ${FriendsButton.fragments.edge}
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($userId: ID!, $friendId: ID!) {
    result: addFriend(input: { userId: $userId, friendId: $friendId }) {
      edge {
        ...FriendsButton_edge
      }
    }
  }

  ${FriendsButton.fragments.edge}
`;


const deleteFriendMutation = gql`
  mutation DeleteFriendMutation($userId: ID!, $friendId: ID!) {
    result: deleteFriend(input: { userId: $userId, friendId: $friendId }) {
      deletedId
    }
  }
`;

const updateCache = (cache, variables, edges = []) => {
  const data = cache.readQuery({ query: userQuery, variables });

  cache.writeQuery({
    query: userQuery,
    variables,
    data: update(data, {
      me: {
        friends: {
          edges: { $set: edges },
        },
      },
    }),
  });
};

const commonMutationOptions = {
  /**
   * TODO: Think about this approach one more time. 
   * This way of refetching data looks good, but we have some magic strings here wich is not super.
   */
  refetchQueries: [
    'UserFriendsQuery',
    'MyFriendsQuery',
  ],
};

@graphql(userQuery, {
  options: ({ userId }) => ({
    variables: { userId },
  }),
})
@graphql(addFriendMutation, {
  name: 'addFriend',
  options: {
    ...commonMutationOptions,
  },
})
@graphql(deleteFriendMutation, {
  name: 'deleteFriend',
  options: {
    ...commonMutationOptions,
  },
})
export default class FriendsButtonContainer extends Component {
  static displayName = 'Container(FriendsButton)';
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  onDeletePress = () => {
    const { userId, deleteFriend, data: { me } } = this.props;
    const [ edge ] = me.friends.edges;

    deleteFriend({
      variables: {
        userId: me.id,
        friendId: userId,
      },
      optimisticResponse: {
        result: {
          __typename: 'DeleteFriendPayload',
          deletedId: edge?.friendship.id,
        },
      },
      update: cache => updateCache(cache, { userId }, []),
    });
  }

  onAddPress = () => {
    const { userId, addFriend, data: { me } } = this.props;
    const [ friendship ] = me.friends.edges;
    const optimisticEdge = FriendsButton.createOptimisticEdge({
      userId: me.id,
      friendId: userId,
      status: friendship && 'ACTIVE',
      friendshipId: friendship?.id,
    });

    addFriend({
      variables: {
        userId: me.id,
        friendId: userId,
      },
      optimisticResponse: {
        result: {
          __typename: 'AddFriendPayload',
          edge: optimisticEdge,
        },
      },
      update: (cache, { data }) => updateCache(cache, { userId }, [data.result.edge]),
    });
  };

  render() {
    const { data: { me, loading }, ...props } = this.props;

    return (
      <FriendsButton
        edge={me?.friends.edges[0]}
        loading={loading}
        onAcceptPress={this.onAddPress}
        onAddPress={this.onAddPress}
        onCancelPress={this.onDeletePress}
        onDeletePress={this.onDeletePress}
  
        {...props} 
      />
    );
  }
}
