import React from 'react';

import { createHeadingTabsNavigator, TabBarIcon, LogoutButton, ScreenHeader } from '~components';
import ProfileHeading from './ProfileHeading';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <ProfileHeading {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: ProfileHeading.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    headerBackground: null,
    headerRight: <LogoutButton />,
    tabBarIcon: ({ tintColor: color }) => (
      <TabBarIcon name="user-bar" style={{ color }} />
    ),
  },
});
