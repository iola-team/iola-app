import { NavigationActions } from 'react-navigation'

import { AUTHENTICATION_ROUTE, MESSENGER_ROUTE } from '../constants';

export const openMessenger = (user) => (dispatch, getState) => {
  dispatch(NavigationActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: MESSENGER_ROUTE
      }),
    ]
  }));
};

export const startAuthentication = () => (dispatch, getState) => {
  dispatch(NavigationActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: AUTHENTICATION_ROUTE
      })
    ]
  }));
};