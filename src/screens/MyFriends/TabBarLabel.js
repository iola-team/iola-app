import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { FriendsTabBarLabel } from '~components';

@graphql(gql`
  query MyFriendsTabBarLabelQuery {
    me {
      id
      ...FriendsTabBarLabel_me
    }
  }

  ${FriendsTabBarLabel.fragments.me}
`)
export default class MyFriendsTabBarLabel extends Component {
  render() {
    const { data: { me } } = this.props;

    return <FriendsTabBarLabel me={me} />;
  }
}