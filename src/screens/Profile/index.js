import React from 'react';

import { createHeadingTabsNavigator, LogoutButton, ScreenHeader } from '~components';
import ProfileHeading from './ProfileHeading';
import TabBarIcon from './TabBarIcon';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <ProfileHeading {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: ProfileHeading.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    headerBackground: null,
    headerRight: <LogoutButton />,
    tabBarIcon: props => <TabBarIcon {...props} />,
  },
});
