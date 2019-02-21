import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { View, StyleSheet, Animated } from 'react-native';

import { withStyle } from '~theme';

const Gradient = Animated.createAnimatedComponent(LinearGradient);
const animatedValue = new Animated.Value(0);
let animation = null;
let componentsCount = 0;

const retainAnimation = () => {
  animation = animation || Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      isInteraction: false,
      useNativeDriver: true,
    }),
  );

  if (componentsCount === 0) {
    animation.start();
  }

  componentsCount++;
};

const releaseAnimation = () => {
  componentsCount--;

  if (componentsCount <= 0) {
    animation.stop();
    componentsCount = 0;
  }
};

@withStyle('Sparkle.Placeholder')
export default class Placeholder extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    isActive: true,
  };

  state = {
    layout: null,
  };

  onLayout = ({ nativeEvent: { layout } }) => {
    this.setState({ layout });
  };

  componentDidMount() {
    retainAnimation();
  }

  componentWillUnmount() {
    releaseAnimation();
  }

  render() {
    const { style, children, isActive, ...props } = this.props;
    const { layout } = this.state;

    const animationStyle = layout && {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [0.5, 1],
            outputRange: [-layout.width, layout.width],
          }),
        },
      ],
    };

    return (
      <View
        {...props}
        style={[style, { overflow: 'hidden' }]}
        onLayout={this.onLayout}
      >
        {children}

        {layout && isActive && (
          <Gradient
            style={[StyleSheet.absoluteFill, animationStyle]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.8)',
              'rgba(255, 255, 255, 0)',
            ]}
          />
        )}
      </View>
    );
  }
}
