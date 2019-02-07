/* eslint-disable import/first */
import './polyfill';

import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';
import { GRAPHQL_URL, GRAPHQL_SUBSCRIPTIONS_URL } from 'react-native-dotenv';

import createApiClient from 'graph';
import Theme from 'theme';
import Application from 'application';
import Storybook from 'storybook/UI';
import { Root } from 'components';
import { AsyncStorage } from 'react-native';

import WebsiteURLScreen from './screens/WebsiteURL/WebsiteURL';
/* eslint-enable */

class ApplicationRoot extends Component {
  state = {
    isReady: false,
  };

  apiClient = null;

  async init(platformURL) {
    const devMode = true; // @TODO: Add devMode to the app
    const apiURL = devMode ? GRAPHQL_URL : platformURL; // @TODO: Do some preparations and checks for platformURL
    const subscriptionsURL = (devMode)
      ? GRAPHQL_SUBSCRIPTIONS_URL
      : apiURL.replace('api/graphql', 'api/subscriptions'); // @TODO: Maybe we can export it to .env file :thinking_face:

    this.apiClient = await createApiClient(apiURL, subscriptionsURL);
    this.setState({ isReady: true });
  }

  async componentDidMount() {
    try {
      const platformURL = await AsyncStorage.getItem('platformURL');

      if (platformURL !== null) this.init(platformURL);
    } catch (error) {
      // @TODO: display Error message?
    }
  }

  onApplicationReady() {
    SplashScreen.hide();
  }

  async onApplicationReset() {
    try {
alert('aha!');
      await AsyncStorage.removeItem('platformURL');
      this.setState({ isReady: false });
    } catch (error) {
      // @TODO: display Error message?
    }
  }

  render() {
    const { isReady } = this.state;

    return isReady ? (
      <ApolloProvider client={this.apiClient}>
        <Theme>
          <Root>
            <Application onReady={this.onApplicationReady} onReset={::this.onApplicationReset} />
          </Root>
        </Theme>
      </ApolloProvider>
    ) : (
      <WebsiteURLScreen onSubmit={::this.init} />
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
