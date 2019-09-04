import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * TODO: Think of migrating it to use `react-native-fast-image` instead of `react-native` Image
 */
import { Animated, Easing, Dimensions } from 'react-native';
import { Container, View } from 'native-base';
import { isFunction } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import LogoAnimated from '../LogoAnimated';

@styleSheet('iola.BackgroundWithAnimatedLogo', {
  logo: {
    position: 'absolute',
    alignSelf: 'center',
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    paddingHorizontal: '10%',
    backgroundColor: '#5259FF',
  },
})
export default class BackgroundWithAnimatedLogo extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  constructor() {
    super();

    const { height: screenHeight } = Dimensions.get('window');
    const logoHeight = 54; // TODO: this value is coupled with the LogoAnimated component height :(
    const logo = {
      animation: new Animated.Value(0),
      translateY: screenHeight / 2 - screenHeight * 0.1 - logoHeight / 2,
      scale: 0.7,
    };

    this.logo = {
      ...logo,
      styles: {
        top: screenHeight / 2 - logoHeight / 2,
        transform: [
          {
            translateY: logo.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, -logo.translateY],
            }),
          },
          {
            scaleX: logo.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, logo.scale],
            }),
          },
          {
            scaleY: logo.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, logo.scale],
            }),
          },
        ],
      },
    };

    this.content = {
      animation: new Animated.Value(0),
      styles: {
        marginTop: logoHeight + this.logo.styles.top - logo.translateY + 65,
      },
    };

    this.state = {
      currentAnimationName: null,
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  getIsAnimationRunBack = () => {
    const { currentAnimationName } = this.state;

    return !currentAnimationName || currentAnimationName === 'run back';
  };

  runAnimation = (callback = () => null) => {
    const isAnimationRunBack = this.getIsAnimationRunBack();

    this.setState({ currentAnimationName: isAnimationRunBack ? 'run' : 'run back' });

    Animated.timing(this.logo.animation, {
      toValue: isAnimationRunBack ? 1 : 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.content.animation, {
      toValue: isAnimationRunBack ? 1 : 0,
      duration: isAnimationRunBack ? 800 : 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    setTimeout(callback, isAnimationRunBack ? 800 : 500);
  };

  render() {
    const { children, styleSheet: styles } = this.props;
    const isAnimationRunBack = this.getIsAnimationRunBack();

    return (
      <Container>
        <View style={styles.content}>
          <Animated.View style={[styles.logo, this.logo.styles]}>
            <LogoAnimated loading={isAnimationRunBack} />
          </Animated.View>
          <Animated.View
            style={[this.content.styles, { opacity: this.content.animation }]}
            pointerEvents={isAnimationRunBack ? 'none' : 'auto'}
          >
            {isFunction(children) ? children(this.runAnimation) : children}
          </Animated.View>
        </View>
      </Container>
    );
  }
}
