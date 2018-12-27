import React from 'react';

import { Icon, ScreenHeader, createHeadingTabsNavigator } from 'components';
import DashboardHeading from './DashboardHeading';
import LogoutButton from './LogoutButton';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <DashboardHeading {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: DashboardHeading.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    headerRight: <LogoutButton />,
    tabBarIcon: ({ tintColor: color }) => (
      <Icon name="user-bar" style={{ color, fontSize: 20 }} />
    ),
  },
});