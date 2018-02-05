import { handleAction } from 'redux-actions';

import { INCREMENT } from '../actionTypes';

export const getCounter = state => state;

export default handleAction(INCREMENT, counter => counter + 1, 0);
