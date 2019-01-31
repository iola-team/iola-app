import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { FriendsTabBarLabel } from 'components';

@graphql(gql`
  query UserFriendsTabBarLabelQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...FriendsTabBarLabel_user
    }
  }

  ${FriendsTabBarLabel.fragments.user}
`, {
  options: ({ userId }) => ({
    variables: {
      userId,
    },
  }),
})
export default class UserFriendsTabBarLabel extends Component {
  render() {
    const { data: { user } } = this.props;

    return <FriendsTabBarLabel user={user} />;
  }
}