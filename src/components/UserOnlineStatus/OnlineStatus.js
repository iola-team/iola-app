import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'native-base';

import { withStyle } from '~theme';

@withStyle('Sparkle.OnlineStatus', {
  'NativeBase.ViewNB': {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDC0CB',

    '.online': {
      backgroundColor: '#3BC486',
    },
  },
})
export default class OnlineStatus extends Component {
  static propTypes = {
    online: PropTypes.bool.isRequired,
  };

  render() {
    const onlineProp = { online: this.props.online };

    return <View {...onlineProp} />;
  }
}
