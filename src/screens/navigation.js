import { StackNavigator } from 'react-navigation';

// Rout names
import * as routes from './roteNames';

// Screens
import SignIn from './SignIn';
import Launch from './Launch';
import User from './User';

// Navigator
export default StackNavigator({
  [routes.SIGN_IN]: {
    screen: SignIn,
    navigationOptions: {
      header: null,
    },
  },

  [routes.LAUNCH]: {
    screen: Launch,
    navigationOptions: {
      header: null,
    },
  },

  [routes.USER]: {
    screen: User,
    navigationOptions: {
      title: "User",
    },
  },
}, {
  initialRouteName: routes.SIGN_IN,
});
