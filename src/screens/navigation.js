import React from 'react';
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

// Components
import { ScreenHeader, BottomTabBar } from 'components';

// Route names
import * as routes from './routeNames';

// Screens
import Channel from './Channel';
import Channels from './Channels';
import DashboardAll from './DashboardAll';
// import DashboardFeatured from './DashboardFeatured';
// import DashboardFriends from './DashboardFriends';
import EmailVerification from './EmailVerification';
import ForgotPassword from './ForgotPassword';
import Launch from './Launch';
import MyFriends from './MyFriends';
import MyInfo from './MyInfo';
import MyPhotos from './MyPhotos';
import Notifications from './Notifications';
import ProfileEdit from './PropfileEdit';
import Settings from './Settings';
import SignIn from './SignIn';
import SignUp from './SignUp';
import UserFriends from './UserFriends';
import UserInfo from './UserInfo';
import UserPhotos from './UserPhotos';

import createUserNavigator from './User';
import createDashboardNavigator from './Dashboard';
import createProfileNavigator from './Profile';

// Navigator
const TabsNavigator = createBottomTabNavigator({
  [routes.DASHBOARD]: createDashboardNavigator({
    [routes.DASHBOARD_ALL]: DashboardAll,
    // [routes.DASHBOARD_FRIENDS]: DashboardFriends,
    // [routes.DASHBOARD_FEATURED]: DashboardFeatured,
  }, {
    bottomBarHeight: BottomTabBar.HEIGHT,
  }),
  [routes.CHANNELS]: Channels,
  [routes.NOTIFICATIONS]: Notifications,
  [routes.PROFILE]: createProfileNavigator({
    [routes.PROFILE_PHOTOS]: MyPhotos,
    [routes.PROFILE_INFO]: MyInfo,
    [routes.PROFILE_FRIENDS]: MyFriends,
  }, {
    bottomBarHeight: BottomTabBar.HEIGHT,
  }),
}, {
  initialRouteName: routes.DASHBOARD,
  tabBarComponent: BottomTabBar,
});

const RootNavigator = createSwitchNavigator({
  [routes.AUTHENTICATION]: createStackNavigator({
    [routes.SIGN_IN]: SignIn,
    [routes.SIGN_UP]: SignUp,
    [routes.FORGOT_PASSWORD]: ForgotPassword,
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
      navigationOptions({ navigation: { state } }) {
        const TabComponent = TabsNavigator.router.getComponentForRouteName(state.routes[state.index].routeName);

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
        [routes.USER_PHOTOS]: UserPhotos,
        [routes.USER_INFO]: UserInfo,
        [routes.USER_FRIENDS]: UserFriends,
      }),
    },

    [routes.CHANNEL]: Channel,
    [routes.SETTINGS]: Settings,
    [routes.PROFILE_EDIT]: ProfileEdit,
  }, {
    headerLayoutPreset: 'center',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    cardShadowEnabled: false,
    cardOverlayEnabled: true,

    defaultNavigationOptions: {
      header: props => <ScreenHeader {...props} />,
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