import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing } from 'react-native';

import { withStyleSheet as styleSheet } from '~theme';
import logoImage from './logo.png';

@styleSheet('iola.LogoAnimated', {
  logo: {
    width: 102,
    height: 54,
    resizeMode: 'contain',
  },
})
export default class LogoAnimated extends Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  componentDidMount() {
    this.runAnimation();
  }

  animation = new Animated.Value(1);
  animationValue = 1;

  runAnimation = () => {
    const { animation, animationValue } = this;

    Animated.timing(animation, {
      toValue: animationValue,
      duration: 700,
      easing: Easing.easeInEaseOut,
      useNativeDriver: true,
    }).start(() => {
      if (this.props.loading) {
        this.animationValue = animationValue === 1 ? 0.3 : 1;
      } else {
        this.animationValue = 1;
      }

      this.runAnimation();
    });
  };

  render() {
    const { styleSheet: styles } = this.props;

    return <Animated.Image style={[styles.logo, { opacity: this.animation }]} source={logoImage} />;
  }
}
