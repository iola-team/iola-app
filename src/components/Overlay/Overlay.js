import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Gateway } from 'react-gateway';
import { View, StyleSheet } from 'react-native';

import { withStyle } from 'theme';

@withStyle('Sparkle.Overlay', {
  ...StyleSheet.absoluteFillObject,
})
export default class Overlay extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    isVisible: false,
  };

  render() {
    const { isVisible, ...props } = this.props;

    return isVisible && (
      <Gateway into="root">
        <View {...props} />
      </Gateway>
    );
  }
}
