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

    'NativeBase.Icon': {
      fontSize: 46,
    },
  },

  'NativeBase.Text': {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
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
    const iconContainerStyle = { backgroundColor: inverted ? 'white' : '#F8F9FB' };
    const iconStyle = { color: inverted ? '#F1F2F7' : '#C5CAD1' };
    const labelStyle = { color: inverted ? '#BDC0CB' : '#C5CAD1' };

    if (iconScale) {
      iconContainerStyle.transform = [
        { scale: iconScale },
      ];

      if (text) {
        labelStyle.transform = [
          {
            translateY: iconScale.interpolate({
              inputRange: [0, 1],
              outputRange: [-120, 0],
            }),
          }
        ];
      }
    }

    return (
      <Animated.View {...props}>
        <AnimatedView highlight style={iconContainerStyle}>
          <Icon name={icon} style={iconStyle} />
        </AnimatedView>

        {text && <AnimatedText style={labelStyle}>{text}</AnimatedText>}
      </Animated.View>
    );
  }
}
