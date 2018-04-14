import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';

import { loadStories } from './storyLoader';

export * from './decorators';

export default class StorybookHMR extends Component {
  constructor(...args) {
    super(...args);

    configure(() => {
      loadStories()
    }, module);

    this.Storybook = getStorybookUI({
      port: 7007,
      onDeviceUI: false,
    });
  }

  render() {
    const Storybook = this.Storybook;

    return (
      <Storybook />
    );
  }
}
