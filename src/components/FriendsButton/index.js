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
    'FriendsButtonQuery',
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
    });
  };

  onAddPress = () => {
    const { userId, addFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: userId,
    };

    addFriend({
      variables: { input },
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
