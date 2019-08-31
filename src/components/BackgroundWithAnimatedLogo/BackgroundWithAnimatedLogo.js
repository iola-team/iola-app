import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * TODO: Think of migrating it to use `react-native-fast-image` instead of `react-native` Image
 */
import { Animated, Easing, Dimensions } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import logoImage from './logo.png';

@styleSheet('iola.BackgroundWithAnimatedLogo', {
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
export default class BackgroundWithAnimatedLogo extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor() {
    super();

    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const logoTopFinishScale = 10.2 / 100;
    const contentPaddingHorizontal = 0.1 * 2; // see content.paddingHorizontal in the styles
    const contentWidth = screenWidth * (1 - contentPaddingHorizontal);
    const logoWidth = 102;
    const logoHeight = 54;
    const logoLeft = contentWidth / 2 - logoWidth / 2;
    const logoTop = screenHeight / 2 - logoHeight / 2;
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
    this.content = {
      marginTop: logoTop - logoTranslateY + logoHeight + 65,
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

    Animated.timing(this.content.opacityAnimatedValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const { children, styleSheet: styles } = this.props;
    const {
      width,
      height,
      left,
      top,
      translateY,
      positionAnimatedValue,
      opacityAnimatedValue,
    } = this.logo;
    const { marginTop } = this.content;

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
                      outputRange: [1, -translateY],
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
                ],
              }]}
              source={logoImage}
            />
          </View>

          <Animated.View style={{ marginTop: marginTop, opacity: this.content.opacityAnimatedValue }}>
            {children}
          </Animated.View>
        </View>
      </Container>
    );
  }
}
