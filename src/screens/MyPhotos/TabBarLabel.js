import React, { Component } from 'react';
import { Text } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { PhotosTabBarLabel } from 'components';

@graphql(gql`
  query MyPhotosTabBarLabelQuery {
    me {
      id
      ...PhotosTabBarLabel_user
    }
  }

  ${PhotosTabBarLabel.fragments.user}
`)
export default class MyPhotosTabBarLabel extends Component {
  render() {
    const { data: { me } } = this.props;

    return <PhotosTabBarLabel user={me} />;
  }
}