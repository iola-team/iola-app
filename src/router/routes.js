import { StackNavigator } from 'react-navigation';

// Screens
import { Launch, User } from '../screens';

// Rout names
export const LAUNCH = 'launch';
export const USER = 'user';

// Navigator
export default StackNavigator({
  [LAUNCH]: {
    screen: Launch,
    navigationOptions: {
      header: null,
    },
  },
  [USER]: {
    screen: User,
    navigationOptions: {
      title: "User",
    },
  }
}, {
  initialRouteName: LAUNCH,
});
