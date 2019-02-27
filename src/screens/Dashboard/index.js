import React from 'react';

import { Icon, ScreenHeader, createHeadingTabsNavigator } from '~components';
import DashboardHeading from './DashboardHeading';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <DashboardHeading {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT + 80,
  headerHeight: DashboardHeading.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    tabBarIcon: ({ tintColor: color }) => (
      <Icon name="dashboard-bar" style={{ color, fontSize: 25 }} />
    ),
  },
});