import React, { Component } from 'react';
import { getStorybookUI } from '@storybook/react-native';

import './config';

export * from './decorators';

export default class StorybookHMR extends Component {
  constructor(...args) {
    super(...args);

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
