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
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
  };

  render() {
    const { visible, ...props } = this.props;

    return visible && (
      <Gateway into="root">
        <View {...props} />
      </Gateway>
    );
  }
}
