import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.Spinner')
export default class Spinner extends Component {
  static propTypes = {
    style: PropTypes.any.isRequired,
  };

  render() {
    const { style, ...props } = this.props;
    const { color, ...styles } = StyleSheet.flatten(style);

    return <ActivityIndicator size="small" color={color} {...props} style={styles} />;
  }
}
