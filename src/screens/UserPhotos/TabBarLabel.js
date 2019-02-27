import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { PhotosTabBarLabel } from '~components';

@graphql(gql`
  query UserPhotosTabBarLabelQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...PhotosTabBarLabel_user
    }
  }

  ${PhotosTabBarLabel.fragments.user}
`, {
  options: ({ userId }) => ({
    variables: {
      userId,
    },
  }),
})
export default class UserPhotosTabBarLabel extends Component {
  render() {
    const { data: { user } } = this.props;

    return <PhotosTabBarLabel user={user} />;
  }
}