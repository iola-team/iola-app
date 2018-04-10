import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import Navigator from 'screens';
import createApiClient from 'graph';
import Theme from 'theme';
import Application from 'application';

export default class Root extends Component {
  state = {
    isReady: false,
  };

  apiClient = null;

  constructor(props) {
    super(props);
  }

  async init() {
    this.apiClient = await createApiClient();
  }

  async componentDidMount() {
    await this.init();

    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;

    return isReady ? (
      <ApolloProvider client={this.apiClient}>
        <Theme>
          <Application>
            <Navigator />
          </Application>
        </Theme>
      </ApolloProvider>
    ) : (
      null
    );
  }
}
