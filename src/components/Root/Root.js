import React, { Component, Fragment } from 'react';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { Root as RootNB } from 'native-base';

import { withStyle } from '~theme';

const GatewayComponent = props => <Fragment {...props} />;

@withStyle('Sparkle.Root')
export default class Root extends Component {
  render() {
    const { style, children } = this.props;

    return (
      <GatewayProvider>
        <RootNB style={style}>
          {children}

          <GatewayDest name="root" component={GatewayComponent} />
        </RootNB>
      </GatewayProvider>
    );
  }
}
