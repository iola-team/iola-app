import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { View } from 'react-native';
import { Text, Icon } from 'native-base';

import { withStyle } from 'theme';

@withStyle('Sparkle.MessageStatus', {
  flexDirection: 'row',
  alignItems: 'center',
  height: 20,

  'NativeBase.Icon': {
    fontSize: 35,
    color: '#BDC0CB',
    marginLeft: 5,
    alignItems: 'center',
  },

  'NativeBase.Text': {
    color: '#BDC0CB',
    fontSize: 12,
  },
})
export default class MessageStatus extends PureComponent {
  static propTypes = {
    time: PropTypes.instanceOf(Date).isRequired,
    hasStatus: PropTypes.bool,
  };

  static defaultProps = {

  };

  render() {
    const { time, style, hasStatus } = this.props;

    return (
      <View style={style}>
        <Moment element={Text} format="HH:mm">{time}</Moment>
        {hasStatus && <Icon name={'ios-done-all'} />}
      </View>
    );
  }
}
