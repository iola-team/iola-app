import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { View, StyleSheet } from 'react-native';

import { withStyle } from '~theme';

@withStyle('iola.Shadow', {
  shadowColors: ['rgba(211, 213, 222, 0.1)', 'rgba(211, 213, 222, 0)'],
  shadowSpread: 16,
})
export default class Shadow extends PureComponent {
  static propTypes = {
    top: PropTypes.bool,
    bottom: PropTypes.bool,
    inset: PropTypes.bool,
  };

  static defaultProps = {
    top: false,
    bottom: false,
    inset: false,
  };

  render() {
    const { style, children, top, bottom, inset } = this.props;
    const { shadowColors, shadowSpread, ...viewStyle } = StyleSheet.flatten(style);

    const commonStyles = {
      ...StyleSheet.absoluteFillObject,
      height: shadowSpread,
    };

    const rotate = {
      transform: [{ rotate: '180deg' }],
    };

    return (
      <View style={viewStyle}>
        {children}

        {top && (
          <LinearGradient
            style={{
              ...commonStyles,
              ...(inset ? {} : rotate),
              top: inset ? 0 : -shadowSpread,
              bottom: null,
            }}
            colors={shadowColors}
          />
        )}

        {bottom && (
          <LinearGradient
            style={{
              ...commonStyles,
              ...(inset ? rotate: {}),
              top: null,
              bottom: inset ? 0 : -shadowSpread,
            }}
            colors={shadowColors}
          />
        )}
      </View>
    );
  }
}
