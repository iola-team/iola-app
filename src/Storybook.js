import './polyfill';
import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from '~theme';
import StorybookUI from '~storybook/UI';

export default class Storybook extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Theme>
        <StorybookUI />
      </Theme>
    );
  }
}
