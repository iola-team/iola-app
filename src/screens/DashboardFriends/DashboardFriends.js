import React, { PureComponent } from 'react';

import { withStyleSheet } from 'theme';
import { USER } from '../routeNames';
import DashboardFriendsConnection from './DashboardFriendsConnection';

@withStyleSheet('Sparkle.DashboardFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
export default class DashboardFriends extends PureComponent {
  static navigationOptions = {
    title: 'Friends',
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(USER, { id: node.id });
  };

  render() {
    return <DashboardFriendsConnection onItemPress={this.onItemPress} />;
  }
}
