import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as ViewRN } from 'react-native';
import { Icon } from 'native-base';

import { withStyle } from 'theme';

@withStyle('Sparkle.MessageStateIndicator', {
  height: 14,
  flexDirection: 'row',
  alignItems: 'center',

  'NativeBase.Icon': {
    fontSize: 35,
    color: '#BDC0CB',
  },
})
export default class MessageStateIndicator extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    const { style } = this.props;

    return (
      <ViewRN style={style}>
        <Icon name={'ios-done-all'} />
      </ViewRN>
    );
  }
}
