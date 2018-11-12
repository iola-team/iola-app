import React, { Component } from 'react';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { View } from 'react-native';
import { Root as RootNB } from 'native-base';

/**
 * TODO: remove when fixed
 * https://github.com/cloudflare/react-gateway/issues/40
 */
const GatewayComponent = props => <View { ...props } />;

export default class Root extends Component {
  render() {
    const { children } = this.props;

    return (
      <GatewayProvider>
        <RootNB>
          {children}

          <GatewayDest name="root" component={GatewayComponent} />
        </RootNB>
      </GatewayProvider>
    );
  }
}
