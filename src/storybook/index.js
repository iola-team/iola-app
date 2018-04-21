import React, { Component } from 'react';
import { getStorybookUI } from '@storybook/react-native';
import addons from '@storybook/addons';

import configure from './config';

export * from './decorators';

export default class StorybookHMR extends Component {
  configured = false;

  constructor(...args) {
    super(...args);

    this.Storybook = getStorybookUI({
      port: 7007,
      onDeviceUI: false,
    });
  }

  componentDidMount() {

    /**
     * Delay storybook configuration to prevent channel errors
     *
     * Related issue: https://github.com/storybooks/storybook/issues/1192
     *
     * TODO: Refactor it whe the issue is resolved
     */
    configure();
  }

  render() {
    const Storybook = this.Storybook;

    return (
      <Storybook />
    );
  }
}
