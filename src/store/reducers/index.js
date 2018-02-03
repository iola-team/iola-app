import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import apiClient, { REDUCER_NAME as API_REDUCER_NAME } from '../../api';
import { reducer as navigationReducer, REDUCER_NAME as NAV_REDUCER_NAME } from '../../router';

const reducers = {
	[NAV_REDUCER_NAME]: navigationReducer,
	[API_REDUCER_NAME]: apiClient.reducer(),
	form: formReducer,
};

export default () => {
	return combineReducers(reducers);
};
