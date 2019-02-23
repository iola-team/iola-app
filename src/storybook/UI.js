import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import { DEV_IP } from 'react-native-dotenv';
import { loadStories } from './storyLoader';

export default class Storybook extends Component {
  constructor(...args) {
    super(...args);

    // Load stories
    configure(loadStories, module);

    // Load configuration
    require('./config');

    this.ui = getStorybookUI({
      host: DEV_IP,
      port: 7007,
      onDeviceUI: false,
    });
  }

  render() {
    const UI = this.ui;

    return <UI />;
  }
};