/* eslint-disable import/first */
import './polyfill';

import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';

import createApiClient from 'graph';
import Theme from 'theme';
import Application from 'application';
import Storybook from 'storybook/UI';
import { Root } from 'components';
/* eslint-enable */

class ApplicationRoot extends Component {
  state = {
    isReady: false,
  };

  apiClient = null;

  async init() {
    this.apiClient = await createApiClient();
  }

  async componentDidMount() {
    await this.init();

    this.setState({
      isReady: true,
    });
  }

  onApplicationReady() {
    SplashScreen.hide();
  }

  render() {
    const { isReady } = this.state;

    return isReady ? (
      <ApolloProvider client={this.apiClient}>
        <Theme>
          <Root>
            <Application onReady={::this.onApplicationReady} />
          </Root>
        </Theme>
      </ApolloProvider>
    ) : (
      null
    );
  }
}

class StorybookRoot extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Theme>
        <Root>
          <Storybook />
        </Root>
      </Theme>
    );
  }
}

export default class extends Component {
  render() {
    const { isStorybook } = this.props;

    return (
      isStorybook ? (
        <StorybookRoot />
      ) : (
        <ApplicationRoot />
      )
    );
  }
}
