import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.OnlineStatus', {
  status: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDC0CB',
  },

  online: {
    backgroundColor: '#3BC486',
  },
})
export default class UserOnlineStatus extends Component {
  static propTypes = {
    online: PropTypes.bool.isRequired,
  };

  render() {
    const { online, styleSheet: styles } = this.props;

    return <View style={[styles.status, online && styles.online]} />;
  }
}
