import React, { PureComponent } from 'react';

import { withStyleSheet } from 'theme';
import { USER } from '../routeNames';
import DashboardFeaturedConnection from './DashboardFeaturedConnection';

@withStyleSheet('Sparkle.DashboardFeaturedScreen', {
  list: {
    paddingTop: 8,
  },
})
export default class DashboardFeatured extends PureComponent {
  static navigationOptions = {
    title: 'Featured',
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(USER, { id: node.id });
  };

  render() {
    return <DashboardFeaturedConnection onItemPress={this.onItemPress} />;
  }
}