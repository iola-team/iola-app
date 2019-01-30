import React, { Component } from 'react';
import { Animated, Easing, Dimensions, Image } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import * as routes from '../routeNames';
import LaunchForm from './LaunchForm';
import logo from './logo.png';

@styleSheet('Sparkle.LaunchScreen', {
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
  state = { me: undefined };

  constructor() {
    super();

    const logoWidthScale = 25.5 / 100;
    const logoTopFinishScale = 10.2 / 100;
    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const { height: logoAssetHeight, width: logoAssetWidth } = Image.resolveAssetSource(logo);
    const contentPaddingHorizontal = 0.1 * 2; // see content.paddingHorizontal in the styles
    const contentWidth = screenWidth * (1 - contentPaddingHorizontal);
    const getCoefficient = scale => screenWidth * scale / logoAssetWidth;
    const logoWidth = logoAssetWidth * getCoefficient(logoWidthScale);
    const logoHeight = logoAssetHeight * getCoefficient(logoWidthScale);
    const logoLeft = contentWidth / 2 - logoWidth / 2;
    const logoTop = screenHeight / 2 - logoHeight;
    const logoTranslateY = screenHeight / 2 - logoHeight / 2 - screenHeight * logoTopFinishScale;

    this.logoSizeFinishScale = 0.7;
    this.logo = {
      width: logoWidth,
      height: logoHeight,
      left: logoLeft,
      top: logoTop,
      translateY: logoTranslateY,
      positionAnimatedValue: new Animated.Value(0),
      opacityAnimatedValue: new Animated.Value(1),
      pulsingAnimationValue: 1,
      interval: setInterval(::this.handlePulsingAnimation, 900),
    };
    this.form = {
      marginTop: (
        screenHeight * logoTopFinishScale + (logoHeight * this.logoSizeFinishScale / 2) + 85
      ),
      opacityAnimatedValue: new Animated.Value(0),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { me } = props.data;

    if (me !== state.me) return { me };

    return state;
  }

  componentDidUpdate(nextProps, prevState) {
    const { navigation: { navigate } } = this.props;
    const { me } = this.state;

    if (me !== prevState.me) {
      if (me) {
        navigate(routes.APPLICATION);
      } else {
        Animated.timing(this.logo.positionAnimatedValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();

        Animated.timing(this.form.opacityAnimatedValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    }
  }

  handlePulsingAnimation() {
    const { data: { loading }} = this.props;
    const { opacityAnimatedValue, pulsingAnimationValue, interval } = this.logo;
    const animate = toValue => {
      Animated.timing(opacityAnimatedValue, {
        toValue,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };

    if (!loading) {
      clearInterval(interval);
      animate(1);

      return;
    }

    animate(pulsingAnimationValue);
    this.logo.pulsingAnimationValue = pulsingAnimationValue === 0.3 ? 1 : 0.3;
  }

  onSubmit({ url }) {
    const { navigation: { navigate } } = this.props;

    // @TODO: save it in the store
    // alert(url);

    navigate(routes.AUTHENTICATION);
  }

  render() {
    const { styleSheet: styles, data: { loading } } = this.props;
    const {
      width,
      height,
      left,
      top,
      translateY,
      positionAnimatedValue,
      opacityAnimatedValue,
    } = this.logo;
    const { marginTop } = this.form;

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
                    translateY: positionAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, -translateY]
                    })
                  },
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

          {!loading && (
            <Animated.View style={{ marginTop, opacity: this.form.opacityAnimatedValue }}>
              <LaunchForm onSubmit={::this.onSubmit} />
            </Animated.View>
          )}
        </View>
      </Container>
    );
  }
}
