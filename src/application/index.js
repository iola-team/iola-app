import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { Text } from 'native-base';
import { NetInfo, AppState } from 'react-native';

import Navigator from '~screens';
import { ROOT_QUERY } from '~graph';
import { ConnectivityIndicator } from '~components';

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
    onReady: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  state = {
    isOnline: true,
    screenProps: {
      onApplicationReset: this.props.onReset,
    },
  };

  onConnectionChange = isOnline => this.setState({ isOnline });
  onAppStateChange = appState => {
    if (appState === 'active') {
      NetInfo.isConnected.fetch().then(this.onConnectionChange);
    }
  }

  componentDidMount() {
    this.props.onReady();

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
