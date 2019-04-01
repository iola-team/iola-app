import React from 'react';

import { createHeadingTabsNavigator, Icon, LogoutButton, ScreenHeader } from '~components';
import ProfileHeading from './ProfileHeading';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <ProfileHeading {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: ProfileHeading.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    headerRight: <LogoutButton />,
    tabBarIcon: ({ tintColor: color }) => (
      <Icon name="user-bar" style={{ color, fontSize: 20 }} />
    ),
  },
});
