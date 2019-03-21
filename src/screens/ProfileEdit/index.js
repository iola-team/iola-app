import React from 'react';

import { ScreenHeader, createHeadingTabsNavigator } from '~components';
import ProfileHeading from './ProfileHeading';

export default (routes, config = {}) => {
  const Navigator = createHeadingTabsNavigator(routes, {
    ...config,
    renderHeader: props => <ProfileHeading {...props} />,
    headerHeight: ProfileHeading.HEIGHT,
    topBarHeight: ScreenHeader.HEIGHT + ProfileHeading.HEIGHT,

    navigationOptions: ({ navigation: { state } }) => {
      const screenOptions = Navigator.router.getScreenOptions({
        state: state.routes[state.index],
      });

      return {
        ...screenOptions,
        title: 'Profile Edit',
        headerStyle: {
          borderBottomWidth: 0,
        },
      };
    },
  });

  return Navigator;
};
