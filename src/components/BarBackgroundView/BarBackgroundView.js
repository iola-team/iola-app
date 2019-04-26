import React, { Component } from 'react';
import { View } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.BarBackgroundView', {
  flex: 1,
  backgroundColor: '#FFFFFF',
  opacity: 0.98,
})
export default class BarBackgroundView extends Component {
  render() {
    const { style } = this.props;

    return <View style={style} />;
  }
}

