import React from 'react';
import { 
  createBottomTabNavigator, 
  createSwitchNavigator, 
  createStackNavigator, 
  createAppContainer,
} from 'react-navigation';

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
import Channel from './Channel';
import ProfileEdit from './PropfileEdit';
import Settings from './Settings';
import UserPhotos from './UserPhotos';
import UserFriends from './UserFriends';
import UserInfo from './UserInfo';
import MyPhotos from './MyPhotos';
import MyInfo from './MyInfo';
import MyFriends from './MyFriends';

import createUserNavigator from './User';
import createDashboardNavigator from './Dashboard';

// Navigator
const TabsNavigator = createBottomTabNavigator({
  [routes.USERS]: Users,
  [routes.CHANNELS]: Channels,
  [routes.DASHBOARD]: createDashboardNavigator({
    [routes.DASHBOARD_PHOTOS]: MyPhotos,
    [routes.DASHBOARD_INFO]: MyInfo,
    [routes.DASHBOARD_FRIENDS]: MyFriends,
  }, {
    bottomBarHeight: BottomTabBar.HEIGHT,
  }),
}, {
  initialRouteName: routes.USERS,
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