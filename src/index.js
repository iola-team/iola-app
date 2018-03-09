import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components/native';

import Navigator from './screens';
import createApiClient from './graph';
import theme from './theme';
import Application from './application';

export default class Root extends Component {
  constructor(props) {
    super(props);

    this.apiClient = createApiClient();
  }

  render() {
    return (
      <ApolloProvider client={this.apiClient}>
        <ThemeProvider theme={theme}>
          <Application>
            <Navigator />
          </Application>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
