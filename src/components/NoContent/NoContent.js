import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { View, Text } from 'native-base';

import { withStyle } from 'theme';
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
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: iconMargin,

    'NativeBase.Icon': {
      color: '#C5CAD1',
      fontSize: 85,
    },
  },

  'NativeBase.Text': {
    color: '#C5CAD1',
    fontSize: 16,
  },
})
export default class NoContent extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string,
    iconScale: PropTypes.object,
  };

  static defaultProps = {
    text: null,
    iconScale: null,
  };

  render() {
    const { icon, text, iconScale, ...props } = this.props;
    const iconStyle = iconScale && {
      transform: [
        { scale: iconScale },
      ],
    };

    const labelStyle = iconScale && text ? {
      transform: [
        {
          translateY: iconScale.interpolate({
            inputRange: [0, 1],
            outputRange: [-120, 0],
          }),
        }
      ],
    } : null;

    return (
      <Animated.View {...props}>
        <AnimatedView highlight style={iconStyle}>
          <Icon name={icon} />
        </AnimatedView>

        {text && <AnimatedText style={labelStyle}>{text}</AnimatedText>}
      </Animated.View>
    );
  }
}
