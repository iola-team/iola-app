import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-native-progress';
import { View, StyleSheet } from 'react-native';

import { withStyle } from '~theme';

const styleSheet = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,

    alignItems: 'center',
    justifyContent: 'center',
  },
});

@withStyle('Sparkle.CircularProgress', {
  color: '#FFFFFF',
  unfilledColor: 'rgba(255,255,255, 0.3)',
  thickness: 4,
  size: 100,
})
export default class CircularProgress extends Component {
  static propTypes = {
    progress: PropTypes.number.isRequired,
    animated: PropTypes.bool,
  };

  static defaultProps = {
    animated: true,
  };

  render() {
    const { progress, animated, style, children } = this.props;

    /**
     * Extract custom style props from style object
     */
    const { color, unfilledColor, thickness, size, ...restStyle } = StyleSheet.flatten(style);

    return (
      <View style={restStyle}>
        <Circle
          animated={animated}
          color={color}
          unfilledColor={unfilledColor}
          borderWidth={0}
          size={size}
          thickness={thickness}
          progress={progress || 0}
        />

        <View style={styleSheet.content}>
          {children}
        </View>
      </View>
    );
  }
}
