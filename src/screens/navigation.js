import { StackNavigator } from 'react-navigation';

// Screens
import Launch from './Launch';
import User from './User';

// Rout names
import * as routes from './roteNames';

// Navigator
export default StackNavigator({
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
  }
}, {
  initialRouteName: routes.LAUNCH,
});
