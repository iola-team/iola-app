import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import TabBarLabel from '../TabBarLabel';

const userFragment = gql`
  fragment PhotosTabBarLabel_user on User {
    id
    photos {
      totalCount
    }
  }
`;

export default class PhotosTabBarLabel extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;

    return <TabBarLabel label="Photos" count={user?.photos.totalCount} />;
  }
}
