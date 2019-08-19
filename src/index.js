/* global __DEV__ */
/* eslint-disable import/first */
import './polyfill';

import React, { Component } from 'react';
import { Linking } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';
import {
  ISSUE_REPORT_URL,
  INTEGRATION_PATH,
  DEV_PLATFORM_URL,
  DEV_URL_PARAMETERS_FOR_API,
  DEV_URL_PARAMETERS_FOR_SUBSCRIPTIONS,
} from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import createApiClient from '~graph';
import { Theme, ConfigurableTheme } from '~theme';
import Application from '~application';
import { Root, ErrorBoundary } from '~components';
import Storybook from '~storybook/UI';
import SplashBackground from '~screens/Launch/SplashBackground';
import LoadingBackground from '~screens/Launch/LoadingBackground';
import WebsiteURLScreen from '~screens/WebsiteURL/WebsiteURL';
/* eslint-enable */

class ApplicationRoot extends Component {
  state = {
    isReady: false,
    initWasLaunched: false,
    initWasTriggeredManually: false,
  };

  apiClient = null;

  async componentDidMount() {
    try {
      const platformURL = await AsyncStorage.getItem('platformURL');

      if (platformURL) this.init(platformURL);
    } catch (error) {
      // TODO: display Error message?
    }

    SplashScreen.hide();
  }

  onRequestRelaunch = () => {
    RNRestart.Restart();
  };

  onReportPress = async () => {
    const canOpen = await Linking.canOpenURL(ISSUE_REPORT_URL);

    if (canOpen) {
      Linking.openURL(ISSUE_REPORT_URL);
    }
  };

  init = async (platformURL, initWasTriggeredManually = false) => {
    this.setState({ initWasLaunched: true, initWasTriggeredManually });

    const url = `${__DEV__ ? DEV_PLATFORM_URL : platformURL}/${INTEGRATION_PATH}`;
    const apiURL = `${url}/graphql${__DEV__ ? DEV_URL_PARAMETERS_FOR_API : ''}`;
    const subscriptionsURL = (
      `${url}/subscriptions${__DEV__ ? DEV_URL_PARAMETERS_FOR_SUBSCRIPTIONS : ''}`
    );

    this.apiClient = await createApiClient({ apiURL, subscriptionsURL });
    this.setState({ isReady: true });
  };

  onApplicationReady = () => {
    SplashScreen.hide();
  };

  onApplicationReset = async () => {
    try {
      this.apiClient.clearStore();
      await AsyncStorage.removeItem('platformURL');
      this.setState({ isReady: false, initWasLaunched: false });
    } catch (error) {
      // TODO: display Error message?
    }
  };

  onError = () => {
    SplashScreen.hide();
    this.apiClient.clearStore();
  };

  render() {
    const { isReady, initWasLaunched, initWasTriggeredManually } = this.state;
    const LoadingScreenComponent = initWasTriggeredManually ? <LoadingBackground /> : <SplashBackground />;
    const displayOnNotReady = (initWasLaunched)
      ? LoadingScreenComponent
      /**
       * TODO: Think of how to not use screens directly
       */
      : <WebsiteURLScreen onSubmit={this.init} />;

    return isReady ? (
      <ApolloProvider client={this.apiClient}>
        <ConfigurableTheme>
          <ErrorBoundary
            onError={this.onError}
            onRequestRelaunch={this.onRequestRelaunch}
            onReportPress={this.onReportPress}
          >
            <Root>
              <Application
                onReady={this.onApplicationReady}
                onReset={this.onApplicationReset}
                initWasTriggeredManually={initWasTriggeredManually}
              />
            </Root>
          </ErrorBoundary>
        </ConfigurableTheme>
      </ApolloProvider>
    ) : <Theme>{displayOnNotReady}</Theme>;
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
