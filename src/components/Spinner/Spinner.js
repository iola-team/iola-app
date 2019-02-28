import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Circle, CircleSnail } from 'react-native-progress';
import { View, StyleSheet } from 'react-native';

import { withStyleSheet as styleSheet } from '~theme';

@styleSheet('Sparkle.Spinner', {
  container: {
    position: 'relative',
  },

  circle: {
    position: 'absolute',
    color: '#FFFFFF',
    unfilledColor: 'rgba(255,255,255, 0.3)',
  },
})
export default class Spinner extends Component {
  static propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    size: 26,
    thickness: 2,
    style: {},
  };

  render() {
    const { styleSheet: styles, size, thickness, style } = this.props;
    const { position } = styles.circle;
    const { color, unfilledColor } = StyleSheet.flatten([styles.circle, style]);

    return (
      <View style={[styles.container, style]}>
        <Circle
          style={{ position, left: thickness, top: thickness }}
          size={size - thickness * 2}
          thickness={thickness}
          unfilledColor={unfilledColor}
          borderWidth={0}
        />
        <CircleSnail
          size={size}
          thickness={thickness}
          color={color}
          direction="clockwise"
          duration={500}
          spinDuration={1500}
          borderWidth={0}
        />
      </View>
    );
  }
}
