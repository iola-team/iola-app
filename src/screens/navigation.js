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
import EmailVerification from './EmailVerification';
import Launch from './Launch';
import Channels from './Channels';
import Users from './Users';
import Dashboard from './Dashboard';
import createUserNavigator, { UserPhotosTab, UserInfoTab, UserFriendsTab } from './User';
import Channel from './Channel';
import ProfileEdit from './PropfileEdit';
import Settings from './Settings';

// Navigator
const TabsNavigator = createBottomTabNavigator({
  [routes.USERS]: {
    screen: Users,
  },

  [routes.CHANNELS]: {
    screen: Channels,
  },

  [routes.DASHBOARD]: {
    screen: Dashboard,
  },
}, {
  initialRouteName: routes.USERS,
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

    [routes.EMAIL_VERIFICATION]: {
      screen: EmailVerification,
      navigationOptions: {
        header: null,
      },
    },
  }, {
    initialRouteName: routes.SIGN_IN,
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
      screen: createUserNavigator({
        [routes.USER_PHOTOS]: UserPhotosTab,
        [routes.USER_INFO]: UserInfoTab,
        [routes.USER_FRIENDS]: UserFriendsTab,
      }),
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
