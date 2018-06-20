import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { View } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';

@withStyle('Sparkle.MessageListSectionHeader', {
  alignSelf: 'center',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderColor: '#BDC0CB',
  borderRadius: 8,
  marginTop: 10,
  marginBottom: 15,
  opacity: 0.35,

  'NativeBase.Text': {
    fontSize: 12,
  }
})
export default class SectionHeader extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
  };

  render() {
    const { style, time } = this.props;

    return (
      <View style={style}>
        <Moment element={Text} format="MMM D">{time}</Moment>
      </View>
    );
  }
}
