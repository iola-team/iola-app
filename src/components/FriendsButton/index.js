import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FriendsButton from './FriendsButton';

const userQuery = gql`
  query FriendsButtonQuery($userId: ID!) {
    user: me {
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

@graphql(userQuery, {
  options: ({ userId }) => ({
    variables: { userId },
  }),
})
export default class FriendsButtonContainer extends Component {
  static displayName = 'Container(FriendsButton)';
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  onAcceptPress = () => null;
  onCancelPress = () => null;
  onDeletePress = () => null;
  onAddPress = () => null;

  render() {
    const { data: { user, loading }, ...props } = this.props;

    return (
      <FriendsButton
        edge={user?.friends.edges[0]}
        loading={loading}
        onAcceptPress={this.onAcceptPress}
        onCancelPress={this.onCancelPress}
        onDeletePress={this.onDeletePress}
        onAddPress={this.onAddPress}
  
        {...props} 
      />
    );
  }
}
