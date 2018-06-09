import React, { Component } from 'react';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { View } from 'react-native';
import { Root as RootNB } from 'native-base';

export default class Root extends Component {
  render() {
    const { children } = this.props;

    return (
      <GatewayProvider>
        <RootNB>
          {children}

          <GatewayDest name="root" component={View} />
        </RootNB>
      </GatewayProvider>
    );
  }
}
