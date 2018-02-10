import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import reducers from '../reducers/index';
import { reducer as navigationReducer, REDUCER_NAME as NAV_REDUCER_NAME } from '../../router/index';

export default () => {
  return combineReducers({
    ...reducers,

    [NAV_REDUCER_NAME]: navigationReducer,
    form: formReducer,
  });
};
