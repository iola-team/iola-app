import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import Navigator from './screens';
import configureApiClient from './graph';

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.apiClient = configureApiClient();
  }

  render() {
    return (
      <ApolloProvider client={this.apiClient}>
        <Navigator />
      </ApolloProvider>
    );
  }
}
