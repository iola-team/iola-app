import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import modules from '../modules';
import apiClient, { REDUCER_NAME as API_REDUCER_NAME } from '../api';
import { reducer as navigationReducer, REDUCER_NAME as NAV_REDUCER_NAME } from '../router';

const reducers = {
	[NAV_REDUCER_NAME]: navigationReducer,
	[API_REDUCER_NAME]: apiClient.reducer(),
	form: formReducer,
};

export default () => {
	const allReducers = modules.reduce((reducers, module) => {
		if (module.reducer) {
			reducers[module.name] = module.reducer;
		}

		return reducers;
	}, reducers);

	return combineReducers(allReducers);
};
