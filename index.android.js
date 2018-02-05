import React from 'react';
import { AppRegistry } from 'react-native';

import App from './src';
import configureStore from './src/store';

AppRegistry.registerComponent('ApolloMessenger', () => {
  const store = configureStore();

  return () => <App store={store} />
});
