import React, { Component, Fragment } from 'react';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { View } from 'react-native';

export default class Root extends Component {
  render() {
    const { children } = this.props;

    return (
      <GatewayProvider>
        <Fragment>
          {children}

          <GatewayDest name="root" component={View} />
        </Fragment>
      </GatewayProvider>
    );
  }
}
