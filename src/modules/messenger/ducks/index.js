import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';
import { NavigationActions } from 'react-navigation';

import { NAME, CHANNELS_VIEW_ROUTE, CHANNELS_INDEX_ROUTE } from '../constants';

/**
 * Selectors
 */
export const getUserSearchPhrase = state => state[NAME].users.search;

export const goToChannel = (channelId) => NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({
      routeName: CHANNELS_INDEX_ROUTE
    }),

    NavigationActions.navigate({
      routeName: CHANNELS_VIEW_ROUTE,
      params: {
        channelId,
      }
    })
  ]
});

export const SEARCH_USERS = 'messenger/searchUsers';
export const searchUsers = createAction(SEARCH_USERS);

const search = handleAction(SEARCH_USERS, (state, { payload }) => payload, '');



export default combineReducers({
  users: combineReducers({
    search
  })
});