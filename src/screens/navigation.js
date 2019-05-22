import React from 'react';
import { View } from 'react-native';
import { useScreens } from 'react-native-screens';
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

// Components
import { ScreenHeader, BottomTabBar, BarBackgroundView } from '~components';

// Route names
import * as routes from './routeNames';

// Screens
import Channel from './Channel';
import Channels from './Channels';
import ChatSearch from './ChatSearch';
import PendingApproval from './PendingApproval';
import EmailVerification from './EmailVerification';
import ForgotPassword from './ForgotPassword';
import Launch from './Launch';
import MyFriends from './MyFriends';
import MyInfo from './MyInfo';
import MyPhotos from './MyPhotos';
import ProfileEdit from './ProfileEdit';
import Settings from './Settings';
import SignIn from './SignIn';
import SignUp from './SignUp';
import UserFriends from './UserFriends';
import UserInfo from './UserInfo';
import UserPhotos from './UserPhotos';
import UserSearch from './UserSearch';
import Users from './Users';

import createUserNavigator from './User';
import createProfileNavigator from './Profile';

useScreens();

// Navigator
const TabsNavigator = createBottomTabNavigator({
  [routes.DASHBOARD]: Users,
  [routes.CHANNELS]: Channels,

  [routes.PROFILE]: createProfileNavigator({
    [routes.PROFILE_PHOTOS]: MyPhotos,
    [routes.PROFILE_INFO]: MyInfo,
    [routes.PROFILE_FRIENDS]: MyFriends,
  }, {
    bottomBarHeight: BottomTabBar.HEIGHT,
  }),
}, {
  initialRouteName: routes.CHANNELS,
  tabBarComponent: BottomTabBar,

  /**
   * TODO: Think about disabling lazy tabs loading
   */
  lazy: true,
  tabBarOptions: {
    barTransparent: true,
  },
});

const RootNavigator = createSwitchNavigator({
  [routes.AUTHENTICATION]: createStackNavigator({
    [routes.SIGN_IN]: SignIn,
    [routes.SIGN_UP]: SignUp,
    [routes.FORGOT_PASSWORD]: ForgotPassword,
    [routes.PENDING_APPROVAL]: PendingApproval,
    [routes.EMAIL_VERIFICATION]: EmailVerification,
  }, {
    initialRouteName: routes.SIGN_IN,
    defaultNavigationOptions: {
      header: null,
    },
  }),

  [routes.APPLICATION]: createStackNavigator({
    [routes.APPLICATION]: {
      screen: TabsNavigator,
      navigationOptions({ navigation, screenProps }) {
        const route = navigation.state.routes[navigation.state.index];
        const childNavigation = navigation.getChildNavigation(route.key);
        const screenOptions = TabsNavigator.router.getScreenOptions(childNavigation, screenProps);

        return {
          /**
           * Pass tab component `navigationOptions` to main stack navigator
           */
          ...screenOptions,
        };
      },
    },
    [routes.USER]: {
      screen: createUserNavigator({
        [routes.USER_PHOTOS]: UserPhotos,
        [routes.USER_INFO]: UserInfo,
        [routes.USER_FRIENDS]: UserFriends,
      }),
    },

    [routes.PROFILE_EDIT]: ProfileEdit,
    [routes.SETTINGS]: Settings,

    [routes.CHANNEL]: Channel,
    [routes.USER_SEARCH]: { screen: UserSearch, params: { isSearch: true } },
    [routes.CHAT_SEARCH]: { screen: ChatSearch, params: { isSearch: true } },
  }, {
    headerLayoutPreset: 'center',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    cardShadowEnabled: false,
    cardOverlayEnabled: true,

    transitionConfig: (to, from) => {
      const toRoute = to.scene.route;
      const fromRoute = from?.scene.route;

      /**
       * TODO: find a way to not hardcode rote names
       */
      const isSearchTransition = (
        toRoute.params?.isSearch && fromRoute?.routeName === routes.APPLICATION
        || fromRoute?.params?.isSearch && toRoute.routeName === routes.APPLICATION
      );

      return !isSearchTransition ? {} : {
        transitionSpec: {
          duration: 0,
        },
      };
    },

    defaultNavigationOptions: {
      header: props => <ScreenHeader {...props} />,
      headerTransparent: true,
      headerBackground: <BarBackgroundView />,
    },
  }),

  [routes.LAUNCH]: {
    screen: Launch,
    defaultNavigationOptions: {
      header: null,
    },
  },
}, {
  initialRouteName: routes.LAUNCH,
});

export default createAppContainer(RootNavigator);