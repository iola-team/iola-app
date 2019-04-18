import React, { Component } from 'react';
import { RefreshControl as RefreshControlRN, StyleSheet } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.RefreshControl', {
  color: '#FFFFFF',
  zIndex: 1,
})
export default class RefreshControl extends Component {
  render() {
    const { style, ...props } = this.props;
    const { color, ...restStyle } = StyleSheet.flatten(style);

    return (
      <RefreshControlRN
        {...props}
        style={restStyle}
        colors={[color]}
        tintColor={color}
      />
    );
  }
}
