import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.Spinner', {
  size: 26,
})
export default class Spinner extends Component {
  static propTypes = {
    style: PropTypes.any.isRequired,
  };

  render() {
    const { style, ...props } = this.props;
    const { size, color, ...styles } = StyleSheet.flatten(style);

    return <ActivityIndicator size={size} color={color} {...props} style={styles} />;
  }
}
