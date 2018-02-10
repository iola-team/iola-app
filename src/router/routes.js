import { StackNavigator } from 'react-navigation';

// Screens
import { Launch } from '../screens';

// Rout names
export const LAUNCH = 'launch';

// Navigator
export default StackNavigator({
  [LAUNCH]: {
    screen: Launch
  }
}, {
  initialRouteName: LAUNCH,
  headerMode: 'none'
});
