import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as ViewRN, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

import { withStyle } from 'theme';

@withStyle('Sparkle.MessageStateIndicator', {
  height: 14,
  flexDirection: 'row',
  alignItems: 'center',

  'NativeBase.Icon': {
    width: 18,
    fontSize: 18,
    color: '#BDC0CB',
  },

  '.done': {
    'NativeBase.Icon': {
      fontSize: 35,
      marginTop: -1,
    },
  },
})
export default class MessageStateIndicator extends Component {
  static propTypes = {
    done: PropTypes.bool,
  };

  static defaultProps = {
    done: false,
  };

  render() {
    const { style, done } = this.props;
    const { color, ...flatStyle } = StyleSheet.flatten(style);
    const colorStyle = color && { color };

    return (
      <ViewRN style={flatStyle}>
        <Icon style={colorStyle} name={done ? 'ios-done-all' : 'checkmark'} />
      </ViewRN>
    );
  }
}
