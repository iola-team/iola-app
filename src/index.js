/* global __DEV__ */
/* eslint-disable import/first */
import './polyfill';

import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';
import {
  DEV_GRAPHQL_URL,
  DEV_GRAPHQL_SUBSCRIPTIONS_URL,
  INTEGRATION_GRAPHQL_ADDRESS,
  INTEGRATION_GRAPHQL_SUBSCRIPTIONS_ADDRESS,
} from 'react-native-dotenv';
import { AsyncStorage } from 'react-native';

import createApiClient from '~graph';
import Theme from '~theme';
import Application from '~application';
import { Root } from '~components';
import Storybook from '~storybook/UI';
import WebsiteURLScreen from '~screens/WebsiteURL/WebsiteURL';
/* eslint-enable */

class ApplicationRoot extends Component {
  state = {
    isReady: false,
  };

  apiClient = null;

  async init(platformURL) {
    const apiURL = __DEV__ ? DEV_GRAPHQL_URL : `${platformURL}/${INTEGRATION_GRAPHQL_ADDRESS}`;
    const subscriptionsURL = (__DEV__)
      ? DEV_GRAPHQL_SUBSCRIPTIONS_URL
      : `${platformURL}/${INTEGRATION_GRAPHQL_SUBSCRIPTIONS_ADDRESS}`;

    this.apiClient = await createApiClient(apiURL, subscriptionsURL);
    this.setState({ isReady: true });
  }

  async componentDidMount() {
    try {
      const platformURL = await AsyncStorage.getItem('platformURL');

      if (platformURL !== null) {
        this.init(platformURL);

        return;
      }
    } catch (error) {
      // @TODO: display Error message?
    }

    SplashScreen.hide();
  }

  onApplicationReady() {
    SplashScreen.hide();
  }

  async onApplicationReset() {
    try {
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
        <Storybook />
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
