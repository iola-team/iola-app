import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

import { Icon, TouchableOpacity, TabBar } from '~components';
import { USER_SEARCH } from '../routeNames';

export default (routes, config = {}) => createMaterialTopTabNavigator(routes, {
  ...config,

  tabBarComponent: TabBar,
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,

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
      <Icon name="friends-bar" style={{ color, fontSize: 25 }} />
    ),
  }),
});