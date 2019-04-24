import React, { Component } from 'react';
import { View } from 'native-base';

import { withStyle } from '~theme';

@withStyle('Sparkle.BarBackgroundView', {
  flex: 1,
  opacity: 0.9,
})
export default class BarBackgroundView extends Component {
  render() {
    const { style } = this.props;

    return <View foreground style={style} />;
  }
}

