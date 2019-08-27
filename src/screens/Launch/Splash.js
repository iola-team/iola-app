import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import logo from './logo.png';

@styleSheet('iola.Splash', {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5259FF',
  },

  logo: {
    width: 120,
    height: 64,
    resizeMode: 'contain',
  },
})
export default class Splash extends Component {
  logo = {
    opacityAnimatedValue: new Animated.Value(1),
    pulsingAnimationValue: 1,
  };

  componentDidMount() {
    this.runPulsingAnimation();
  }

  runPulsingAnimation() {
    const { opacityAnimatedValue, pulsingAnimationValue } = this.logo;

    Animated.timing(opacityAnimatedValue, {
      toValue: pulsingAnimationValue,
      duration: 700,
      easing: Easing.easeInEaseOut,
      useNativeDriver: true,
    }).start(::this.runPulsingAnimation);

    this.logo.pulsingAnimationValue = pulsingAnimationValue === 0.3 ? 1 : 0.3;
  }

  runAnimation() {
    this.animatedValue.setValue(300);
    Animated.timing(this.animatedValue, {
      toValue: -100,
      duration: 3000,
    }).start(() => this.runAnimation());
  }

  render() {
    const { styleSheet: styles } = this.props;
    const { opacityAnimatedValue } = this.logo;

    return (
      <Container>
        <View style={styles.content}>
          <Animated.Image style={[styles.logo, { opacity: opacityAnimatedValue }]} source={logo} />
        </View>
      </Container>
    );
  }
}
