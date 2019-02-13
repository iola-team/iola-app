import React, { Component, Fragment } from 'react';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { Root as RootNB } from 'native-base';

const GatewayComponent = props => <Fragment {...props} />;

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
