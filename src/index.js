import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components/native';

import Navigator from './screens';
import configureApiClient from './graph';
import theme from './theme';

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.apiClient = configureApiClient();
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <ApolloProvider client={this.apiClient}>
        <ThemeProvider theme={theme}>
          <Navigator />
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
