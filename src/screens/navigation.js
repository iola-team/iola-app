import React, { Component } from 'react';
import { Text, View, Footer, FooterTab, Button, Badge, Icon } from 'native-base';
import { SwitchNavigator, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';

// Components
import { ScreenHeader } from 'components';

// Rout names
import * as routes from './roteNames';

// Screens
import SignIn from './SignIn';
import SignUp from './SignUp';
import Launch from './Launch';
import Channels from './Channels';
import Contacts from './Contacts';
import Dashboard from './Dashboard';
import User from './User';
import Channel from './Channel';
import ProfileEdit from './PropfileEdit';
import PhotoPreview from './PhotoPreview';
import Settings from './Settings';

// Navigator
export default SwitchNavigator({
  [routes.AUTHENTICATION]: StackNavigator({
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
  }, {
    initialRouteName: routes.SIGN_IN,
  }),

  [routes.APPLICATION]: StackNavigator({
    [routes.APPLICATION]: {
      screen: TabNavigator({
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
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
          style: {
            backgroundColor: '#FFFFFF',
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },

          labelStyle: {
            fontSize: 14,
          },

          showIcon: true,
          activeTintColor: '#5F96F2',
          inactiveTintColor: '#45474F',
        },
      }),
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

    [routes.PHOTO_PREVIEW]: {
      screen: PhotoPreview,
    },
  }, {
    navigationOptions: {
      header: props => <ScreenHeader {...props} />,
    }
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
