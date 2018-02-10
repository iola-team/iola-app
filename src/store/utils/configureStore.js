import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import { middleware as navMiddleware } from '../../router';
import createRootReducer from './createRootReducer';

const compose = composeWithDevTools({
  name: 'Messenger',
});

export default (initialState) => {
  const middleware = [
    thunk,
    navMiddleware,
  ];
  const enhancers = [];

  const store = createStore(
    createRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextCreateRootReducer = require('./createRootReducer').default;
      store.replaceReducer(nextCreateRootReducer());
    });
  }

  return store
};
