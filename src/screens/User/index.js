import React from 'react';

import { ScreenHeader, createHeadingTabsNavigator } from '~components';
import UserScreenHead from './UserScreenHead';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <UserScreenHead {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: UserScreenHead.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
    headerBackground: null,
  },
});