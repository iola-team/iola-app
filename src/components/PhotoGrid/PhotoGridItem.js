import React, { Component } from 'react';
import { View } from 'react-native';

import { withStyle } from 'theme/index';

@withStyle('Sparkle.PhotoGridItem', {
  flex: 1,
  overflow: 'hidden',
  borderRadius: 8,

  '.placeholder': {
    borderWidth: 1,
    borderColor: '#BDC0CB',
    borderStyle: 'dashed',
  },
})
export default class PhotoGridItem extends Component {
  render() {
    const { style, children } = this.props;

    return (
      <View style={style}>
        {children}
      </View>
    );
  }
}
