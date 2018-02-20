import { StackNavigator } from 'react-navigation';

// Rout names
import * as routes from './roteNames';

// Screens
import Launch from './Launch';
import User from './User';

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
  },
}, {
  initialRouteName: routes.LAUNCH,
});
