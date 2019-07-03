import React, { PureComponent } from 'react';
import { View } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.BarBackgroundView', {
  flex: 1,
  backgroundColor: '#FFFFFF',
  opacity: 0.98,
})
export default class BarBackgroundView extends PureComponent {
  render() {
    const { style } = this.props;

    return <View style={style} />;
  }
}

