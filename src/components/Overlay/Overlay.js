import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Gateway } from 'react-gateway';
import { View, StyleSheet, BackHandler } from 'react-native';

import { withStyle } from '~theme';

@withStyle('iola.Overlay', {
  ...StyleSheet.absoluteFillObject,
})
export default class Overlay extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

  onBackButtonClick = () => {
    const { onRequestClose, visible } = this.props;

    if (!visible) {
      return false;
    }

    onRequestClose();

    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonClick);
  }

  render() {
    const { visible, ...props } = this.props;

    return !!visible && (
      <Gateway into="root">
        <View {...props} />
      </Gateway>
    );
  }
}
