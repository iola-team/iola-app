import React from 'react';
import { ApolloProvider } from 'react-apollo';
import configureStore from './store';

import Router from './router';
import apiClient from './api';

/**
 * Application factory
 * This function will be run once on the application start and will not be executed during HMR
 *
 * @returns function
 */
export default () => {
  const store = configureStore();

  return () => (
    <ApolloProvider store={store} client={apiClient}>
      <Router />
    </ApolloProvider>
  );
}
