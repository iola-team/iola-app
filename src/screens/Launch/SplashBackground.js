import React, { Component } from 'react';
import { Animated, Easing, Dimensions, Image } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import logo from './logo.png';

@styleSheet('Sparkle.SplashBackground', {
  logo: {
    resizeMode: 'contain',
    position: 'absolute',
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
export default class LaunchScreen extends Component {
  constructor() {
    super();

    const logoWidthScale = 25.5 / 100;
    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const { height: logoAssetHeight, width: logoAssetWidth } = Image.resolveAssetSource(logo);
    const contentPaddingHorizontal = 0.1 * 2; // see content.paddingHorizontal in the styles
    const contentWidth = screenWidth * (1 - contentPaddingHorizontal);
    const getCoefficient = scale => screenWidth * scale / logoAssetWidth;
    const logoWidth = logoAssetWidth * getCoefficient(logoWidthScale);
    const logoHeight = logoAssetHeight * getCoefficient(logoWidthScale);
    const logoLeft = contentWidth / 2 - logoWidth / 2;
    const logoTop = screenHeight / 2 - logoHeight;

    this.logoSizeFinishScale = 0.7;
    this.logo = {
      width: logoWidth,
      height: logoHeight,
      left: logoLeft,
      top: logoTop,
      positionAnimatedValue: new Animated.Value(0),
      opacityAnimatedValue: new Animated.Value(1),
      pulsingAnimationValue: 1,
    };
  }

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
    }).start(::this.runPulsingAnimation)

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
    const {
      width,
      height,
      left,
      top,
      positionAnimatedValue,
      opacityAnimatedValue,
    } = this.logo;

    return (
      <Container>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }}>
            <Animated.Image
              style={[styles.logo, {
                position: 'absolute',
                left,
                top,
                height,
                width,
                opacity: opacityAnimatedValue,
                transform: [
                  {
                    scaleX: positionAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, this.logoSizeFinishScale],
                    })
                  },
                  {
                    scaleY: positionAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, this.logoSizeFinishScale],
                    })
                  }
                ]
              }]}
              source={logo}
            />
          </View>
        </View>
      </Container>
    );
  }
}
