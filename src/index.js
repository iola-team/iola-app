import React from 'react';
import { ApolloProvider } from 'react-apollo';

import Navigator from './screens';
import configureApiClient from './graph';

/**
 * Application factory
 * This function will be run once on the application start and will not be executed during HMR
 *
 * @returns function
 */
export default () => {
  const apiClient = configureApiClient();

  return () => (
    <ApolloProvider client={apiClient}>
      <Navigator />
    </ApolloProvider>
  );
}
