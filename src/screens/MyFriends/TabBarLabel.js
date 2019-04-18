import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withNavigation } from 'react-navigation';

import { FriendsTabBarLabel } from '~components';

@graphql(gql`
  query MyFriendsTabBarLabelQuery {
    me {
      id
      ...FriendsTabBarLabel_user
    }
  }

  ${FriendsTabBarLabel.fragments.user}
`)
@withNavigation
export default class MyFriendsTabBarLabel extends Component {
  unsubscribeFromFocus = null;

  /**
   * TODO: It might be better to use Subscriptions to update the counter. Think about it later
   * TODO: Try to move this logic somewhere to be able to reuse it
   */
  componentDidMount() {
    const { navigation, data } = this.props;

    this.unsubscribeFromFocus = navigation.addListener('willFocus', () => {
      if (data) data.refetch();
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromFocus();
  }

  render() {
    const { data: { me } } = this.props;

    return <FriendsTabBarLabel user={me} />;
  }
}