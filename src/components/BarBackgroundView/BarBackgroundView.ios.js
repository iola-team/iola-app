import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { VibrancyView } from "@react-native-community/blur";

import { withStyle } from '~theme';

@withStyle('Sparkle.BarBackgroundView', {
  flex: 1,
  backgroundColor: '#FFFFFF',
  opacity: 0.8,
})
export default class BarBackgroundView extends PureComponent {
  render() {
    const { style } = this.props;
    const { backgroundColor, opacity, ...restStyles } = StyleSheet.flatten(style);

    return (
      <View style={restStyles}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor, opacity }]} />
        <VibrancyView blurAmount={100} blurType="regular" style={StyleSheet.absoluteFill} />
      </View>
    );
  }
}

