import { StackNavigator } from 'react-navigation';

import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../../constants';
import SignInScreen from '../SignInScreen';
import SignUpScreen from '../SignUpScreen';

export default StackNavigator({
  [SIGN_IN_ROUTE]: {
    screen: SignInScreen
  },

  [SIGN_UP_ROUTE]: {
    screen: SignUpScreen
  }
}, {

});