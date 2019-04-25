import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { VibrancyView } from "@react-native-community/blur";

import { withStyle } from '~theme';

@withStyle('Sparkle.BarBackgroundView', {
  flex: 1,
  backgroundColor: '#FFFFFF',
  opacity: 0.6,
})
export default class BarBackgroundView extends Component {
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

