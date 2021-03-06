import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'native-base';

import { withStyle } from '~theme';

@withStyle('iola.OnlineStatus', {
  'NativeBase.ViewNB': {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#AFB2BF',

    '.online': {
      backgroundColor: '#3BC486',
    },
  },
})
export default class OnlineStatus extends PureComponent {
  static propTypes = {
    online: PropTypes.bool.isRequired,
  };

  render() {
    const onlineProp = { online: this.props.online };

    return <View {...onlineProp} />;
  }
}
