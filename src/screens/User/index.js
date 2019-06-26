import React from 'react';

import { ScreenHeader, createHeadingTabsNavigator, UserActions } from '~components';
import UserScreenHead from './UserScreenHead';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader: props => <UserScreenHead {...props} />,
  headerShrinkHeight: ScreenHeader.HEIGHT,
  headerHeight: UserScreenHead.HEIGHT,

  navigationOptions: ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: null,

    headerRight: <UserActions userId={navigation.getParam('id')} />,
  }),
});