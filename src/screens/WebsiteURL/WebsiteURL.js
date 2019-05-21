import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import WebsiteURLForm from './WebsiteURLForm';
import logo from '../Launch/logo.png';

@styleSheet('Sparkle.WebsiteURLScreen', {
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
export default class WebsiteURLScreen extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

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
    };
    this.form = {
      marginTop: (
        screenHeight * logoTopFinishScale + (logoHeight * this.logoSizeFinishScale / 2) + 85
      ),
      opacityAnimatedValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
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

  onSubmit = async ({ url }) => {
    try {
      await AsyncStorage.setItem('platformURL', url);
      this.props.onSubmit(url);
    } catch (error) {
      // @TODO: display Error message?
    }
  }

  render() {
    const { styleSheet: styles } = this.props;
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

          <Animated.View style={{ marginTop, opacity: this.form.opacityAnimatedValue }}>
            <WebsiteURLForm onSubmit={this.onSubmit} />
          </Animated.View>
        </View>
      </Container>
    );
  }
}
