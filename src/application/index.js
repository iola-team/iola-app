import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { Text } from 'native-base';
import { AppState } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getInset } from 'react-native-safe-area-view';

import Navigator from '~screens';
import { ROOT_QUERY } from '~graph';
import { ConnectivityIndicator, ScreenHeader, BottomTabBar } from '~components';

Moment.globalElement = Text;

@graphql(gql`
  query {
    auth @client {
      token
    }
  }
`, {
  props: ({ data: { auth } }) => ({
    isAuthenticated: !!auth.token,
  }),
})
@graphql(ROOT_QUERY, {
  options: ({ isAuthenticated }) => ({
    variables: {
      isAuthenticated,
    }
  }),
})
export default class Application extends Component {
  static propTypes = {
    onApplicationReady: PropTypes.func.isRequired,
    onApplicationReset: PropTypes.func.isRequired,
    initWasTriggeredManually: PropTypes.bool.isRequired,
  };

  state = {
    isOnline: true,
    screenProps: {
      onApplicationReset: this.props.onApplicationReset,
      applicationInitWasTriggeredManually: this.props.initWasTriggeredManually,
      contentInset: {
        top: ScreenHeader.HEIGHT + getStatusBarHeight(true),
        bottom: BottomTabBar.HEIGHT + getInset('bottom'),
      },
    },
  };

  onConnectionChange = isOnline => this.setState({ isOnline });

  onAppStateChange = appState => {
    if (appState === 'active') {
      NetInfo.isConnected.fetch().then(this.onConnectionChange);
    }
  };

  componentDidMount() {
    this.props.onApplicationReady();

    NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange);
    AppState.addEventListener('change', this.onAppStateChange);
  }

  render() {
    const { screenProps, isOnline } = this.state;

    return (
      <ConnectivityIndicator isOnline={isOnline}>
        <Navigator screenProps={screenProps} />
      </ConnectivityIndicator>
    );
  }
}
