import { createAction } from 'redux-actions';

import { INCREMENT } from '../actionTypes';

export const incrementCounter = createAction(INCREMENT);
