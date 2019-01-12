import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FriendsButton from './FriendsButton';

const userQuery = gql`
  query FriendsButtonQuery($userId: ID!) {
    me {
      id
      friends(filter: {
        friendIdIn: [$userId]
        friendshipStatusIn: [ACTIVE, PENDING, IGNORED]
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
  mutation AddFriendMutation($input: AddFriendInput!) {
    result: addFriend(input: $input) {
      friendship {
        id
        status
        user {
          id
        }
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
    const input = {
      userId: me.id,
      friendId: userId,
    };

    deleteFriend({
      variables: { input },
      optimisticResponse: {
        result: null,
      },

      update: (cache) => {
        const variables = { userId };
        const data = cache.readQuery({ query: userQuery, variables });
        data.me.friends.edges = [];
        cache.writeQuery({ query: userQuery, variables, data });
      },
    });
  };

  onAddPress = () => {
    const { userId, addFriend, data: { me } } = this.props;
    const [ { friendship } = {} ] = me.friends.edges;
    const input = {
      userId: me.id,
      friendId: userId,
    };

    const optimisticFriendship = friendship ? {
      ...friendship,
      status: 'ACTIVE',
    } : {
      __typename: 'Friendship',
      id: -1,
      status: 'PENDING',
      user: {
        __typename: 'User',
        id: me.id,
      },
    };

    addFriend({
      variables: { input },
      optimisticResponse: {
        result: {
          __typename: 'AddFriendPayload',
          friendship: optimisticFriendship,
        },
      },

      update: (cache, { data: { result } }) => {
        const variables = { userId };
        const data = cache.readQuery({ query: userQuery, variables });

        data.me.friends.edges = [{
          __typename: 'UserFriendEdge',
          user: {
            __typename: 'User',
            id: userId,
          },
          friendship: result.friendship,
        }];
        cache.writeQuery({ query: userQuery, variables, data });
      },
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
