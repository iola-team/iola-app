import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { View, Text } from 'native-base';

import { withStyle } from '~theme';
import Icon from '../Icon';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);
const iconMargin = 17;

@withStyle('Sparkle.NoContent', {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

  'NativeBase.ViewNB': {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    marginBottom: iconMargin,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',

    'NativeBase.Icon': {
      fontSize: 46,
      color: '#C5CAD1',
    },
  },

  'NativeBase.Text': {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#C5CAD1',
  },

  '.inverted': {
    'NativeBase.ViewNB': {
      backgroundColor: '#F8F9FB',

      'NativeBase.Icon': {
        color: '#F1F2F7',
      },
    },

    'NativeBase.Text': {
      color: '#BDC0CB',
    },
  },
})
export default class NoContent extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string,
    iconScale: PropTypes.object,
    inverted: PropTypes.bool,
  };

  static defaultProps = {
    text: null,
    iconScale: null,
    inverted: false,
  };

  render() {
    const { icon, text, iconScale, inverted, ...props } = this.props;
    const iconContainerStyle = iconScale && { transform: [ { scale: iconScale } ] };
    const labelStyle = iconScale && {
      transform: [{
        translateY: iconScale.interpolate({
          inputRange: [0, 1],
          outputRange: [-120, 0],
        }),
      }]
    };

    return (
      <Animated.View {...props}>
        <AnimatedView style={iconContainerStyle}>
          <Icon name={icon} />
        </AnimatedView>

        {text && <AnimatedText style={labelStyle}>{text}</AnimatedText>}
      </Animated.View>
    );
  }
}
