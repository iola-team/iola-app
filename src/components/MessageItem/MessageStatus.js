import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import MessageStateIndicator from '../MessageStateIndicator';

@withStyle('Sparkle.MessageStatus', {
  flexDirection: 'row',
  alignItems: 'center',
  height: 20,

  'Sparkle.MessageStateIndicator': {
    color: '#BDC0CB',
    marginLeft: 5,
  },

  'NativeBase.Text': {
    color: '#BDC0CB',
    fontSize: 12,
  },
})
export default class MessageStatus extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    hasStatus: PropTypes.bool,
  };

  static defaultProps = {
    hasStatus: false,
  };

  render() {
    const { time, style, hasStatus, status } = this.props;
    const { color, ...flatStyle } = StyleSheet.flatten(style);
    const colorStyle = color && { color };

    return (
      <View style={flatStyle}>
        <Moment style={colorStyle} element={Text} format="HH:mm">{time}</Moment>
        {hasStatus && (
          <MessageStateIndicator style={colorStyle} done={status === 'READ'} />
        )}
      </View>
    );
  }
}
