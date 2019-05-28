import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import MessageStateIndicator from '../MessageStateIndicator';

@withStyle('Sparkle.MessageStatus', {
  flexDirection: 'row',
  alignItems: 'center',
  height: 20,
  marginBottom: -2,

  'NativeBase.Text': {
    fontSize: 10,
    lineHeight: 12,
  },

  '.inverse': {
    'NativeBase.Text': {
      color: '#9B9EF4',
    },
  },

  '.isImage': {
    color: '#FFFFFF',
  },

  'Sparkle.MessageStateIndicator': {
    marginLeft: 5,
  },
})
export default class MessageStatus extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    hasStatus: PropTypes.bool,
    status: PropTypes.string,
  };

  static defaultProps = {
    hasStatus: false,
    status: null,
  };

  render() {
    const { time, style, hasStatus, status } = this.props;
    const { color, ...flatStyle } = StyleSheet.flatten(style);
    const colorStyle = color && { color };

    return (
      <View style={flatStyle}>
        <Moment secondary style={colorStyle} element={Text} format="HH:mm">{time}</Moment>
        {hasStatus && <MessageStateIndicator style={colorStyle} done={status === 'READ'} />}
      </View>
    );
  }
}
