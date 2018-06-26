import React, { Component } from 'react';
import { Text, View, Footer, FooterTab, Button, Badge, Icon } from 'native-base';
import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createTabNavigator } from 'react-navigation';

// Components
import { ScreenHeader, BottomTabBar } from 'components';

// Rout names
import * as routes from './roteNames';

// Screens
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import Launch from './Launch';
import Channels from './Channels';
import Contacts from './Contacts';
import Dashboard from './Dashboard';
import User from './User';
import Channel from './Channel';
import ProfileEdit from './PropfileEdit';
import Settings from './Settings';

// Navigator
const TabsNavigator = createBottomTabNavigator({
  [routes.CONTACTS]: {
    screen: Contacts,
  },

  [routes.CHANNELS]: {
    screen: Channels,
  },

  [routes.DASHBOARD]: {
    screen: Dashboard,
  },
}, {
  initialRouteName: routes.CONTACTS,
  tabBarComponent: BottomTabBar,
});

export default createSwitchNavigator({
  [routes.AUTHENTICATION]: createStackNavigator({
    [routes.SIGN_IN]: {
      screen: SignIn,
      navigationOptions: {
        header: null,
      },
    },

    [routes.SIGN_UP]: {
      screen: SignUp,
      navigationOptions: {
        header: null,
      },
    },

    [routes.FORGOT_PASSWORD]: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null,
      },
    },
  }, {
    initialRouteName: routes.FORGOT_PASSWORD,
  }),

  [routes.APPLICATION]: createStackNavigator({
    [routes.APPLICATION]: {
      screen: TabsNavigator,
      navigationOptions({ navigation: { state } }) {
        const TabComponent = TabsNavigator.router.getComponentForRouteName(state.routes[state.index].routeName)

        return {
          /**
           * Pass tab component `navigationOptions` to main stack navigator
           */
          ...TabComponent.navigationOptions,
        };
      },
    },
    [routes.USER]: {
      screen: User,
    },

    [routes.CHANNEL]: {
      screen: Channel,
    },

    [routes.SETTINGS]: {
      screen: Settings,
    },

    [routes.PROFILE_EDIT]: {
      screen: ProfileEdit,
    },
  }, {
    navigationOptions: {
      header: props => <ScreenHeader {...props} />,
    },
  }),

  [routes.LAUNCH]: {
    screen: Launch,
    navigationOptions: {
      header: null,
    },
  },
}, {
  initialRouteName: routes.LAUNCH,
});
