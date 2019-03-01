import React from 'react';

import { Icon, ScreenHeader, createHeadingTabsNavigator, TouchableOpacity } from '~components';
import { USER_SEARCH } from '../routeNames';

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  topBarHeight: ScreenHeader.HEIGHT,
  
  navigationOptions: ({ navigation }) => ({
    title: 'Users',
    headerStyle: {
      borderBottomWidth: 0,
    },

    headerRight: (
      <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate(USER_SEARCH)}>
        <Icon name="search" style={{ fontSize: 20 }} />
      </TouchableOpacity>
    ),
    tabBarIcon: ({ tintColor: color }) => (
      <Icon name="dashboard-bar" style={{ color, fontSize: 25 }} />
    ),
  }),
});