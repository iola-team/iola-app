import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';

import Router from './router';
import configureStore from './store';
import configureApiClient from './api';

/**
 * Application factory
 * This function will be run once on the application start and will not be executed during HMR
 *
 * @returns function
 */
export default () => {
  const store = configureStore();
  const apiClient = configureApiClient();

  return () => (
    <ApolloProvider client={apiClient}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ApolloProvider>
  );
}
