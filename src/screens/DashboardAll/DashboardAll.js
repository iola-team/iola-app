import React, { PureComponent } from 'react';

import { withStyleSheet } from 'theme';
import { USER } from '../routeNames';
import DashboardAllConnection from './DashboardAllConnection';

@withStyleSheet('Sparkle.DashboardAllScreen', {
  list: {
    paddingTop: 8,
  },
})
export default class DashboardAll extends PureComponent {
  static navigationOptions = {
    title: 'All',
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(USER, { id: node.id });
  };

  render() {
    return <DashboardAllConnection search="" onItemPress={this.onItemPress} />;
  }
}
