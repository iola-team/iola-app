import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import { IP } from 'react-native-dotenv';

import { loadStories } from './storyLoader';

export default class Storybook extends Component {
  constructor(...args) {
    super(...args);

    /**
     * Load configuration
     */
    require('./config');

    /**
     * Load stories
     */
    configure(loadStories, module);

    /**
     * Enable console output in stories
     */
    require('@storybook/addon-console');

    this.ui = getStorybookUI({
      host: IP,
      port: 7007,
      onDeviceUI: false,
    });
  }

  render() {
    const UI = this.ui;

    return <UI />;
  }
};