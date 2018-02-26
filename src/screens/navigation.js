import { StackNavigator, TabNavigator } from 'react-navigation';

// Rout names
import * as routes from './roteNames';

// Screens
import SignIn from './SignIn';
import SignUp from './SignUp';
import Launch from './Launch';
import User from './User';

// Navigator
export default StackNavigator({
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

  [routes.APPLICATION]: TabNavigator({
    [routes.USER]: {
      screen: User,
      navigationOptions: {
        header: null,
      },
    },
  }, {
    initialRouteName: routes.USER,
    tabBarPosition: 'bottom',
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
