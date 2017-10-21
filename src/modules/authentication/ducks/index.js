import { NavigationActions } from 'react-navigation'

import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../constants';

export const showSignIn = () => (dispatch, getState) => {
  dispatch(NavigationActions.navigate({ routeName: SIGN_IN_ROUTE }));
};

export const showSignUp = () => (dispatch, getState) => {
  dispatch(NavigationActions.navigate({ routeName: SIGN_UP_ROUTE }));
};