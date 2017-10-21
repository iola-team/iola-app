import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import Router from './router';
import apiClient from './api';

export default class Root extends Component {
  render() {
    const { store } = this.props;

    return (
      <ApolloProvider store={store} client={apiClient}>
        <Router />
      </ApolloProvider>
    );
  }
}