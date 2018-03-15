import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components/native';

import Navigator from './screens';
import createApiClient from './graph';
import theme from './theme/_styled';
import Theme from './theme';
import Application from './application';
import { assign } from "lodash"
import resolvers from './graph/resolvers'

export default class Root extends Component {
  constructor(props) {
    super(props);

    this.apiClient = createApiClient();
  }

  render() {
    return (
      <ApolloProvider client={this.apiClient}>
        <ThemeProvider theme={theme}>
          <Theme>
            <Application>
              <Navigator />
            </Application>
          </Theme>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
