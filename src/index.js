import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import Navigator from 'screens';
import createApiClient from 'graph';
import Theme from 'theme';
import Application from 'application';

export default class Root extends Component {
  constructor(props) {
    super(props);

    this.apiClient = createApiClient();
  }

  render() {
    return (
      <ApolloProvider client={this.apiClient}>
        <Theme>
          <Application>
            <Navigator />
          </Application>
        </Theme>
      </ApolloProvider>
    );
  }
}
