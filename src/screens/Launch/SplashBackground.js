import React, { Component } from 'react';
import { Animated, Dimensions, Easing, Image, PixelRatio } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import logo from './logo.png';

@styleSheet('Sparkle.SplashBackground', {
  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    backgroundColor: '#5259FF',
  },

  logo: {
    resizeMode: 'contain',
    position: 'absolute',
  },
})
export default class SplashBackground extends Component {
  constructor() {
    super();

    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const { height: logoAssetHeight, width: logoAssetWidth } = Image.resolveAssetSource(logo);
    const paddingHorizontal = 120;
    const logoRatio = (screenWidth - paddingHorizontal * 2) / screenWidth;
    const pixelRatio = PixelRatio.get();
    const logoWidthMax = 240 * pixelRatio;
    let logoWidth = logoAssetWidth * logoRatio;
    let logoHeight = logoAssetHeight * logoRatio;

    if (logoWidth > logoWidthMax) {
      logoWidth = logoWidthMax;
      logoHeight *= logoWidth / logoWidthMax;
    }

    const logoLeft = screenWidth / 2 - logoWidth / 2;
    const logoTop = screenHeight / 2 - logoHeight / 2;

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
