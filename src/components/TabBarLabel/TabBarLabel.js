import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Badge } from 'native-base';

import { withStyle } from '~theme';

@withStyle('iola.TabBarLabel', {
  'NativeBase.Text': {
    '.count': {
      marginLeft: 5,
    },
  },

  'NativeBase.Badge': {
    'NativeBase.Text': {
      lineHeight: 20,
      fontSize: 12,
      fontWeight: 'bold',
    },

    marginLeft: 5,
    height: 20,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },

  height: 20,
  flexDirection: 'row',
  alignItems: 'center',
})
export default class TabBarLabel extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    count: PropTypes.number,
    activeCount: PropTypes.number,
  };

  static defaultProps = {
    count: null,
    activeCount: null,
  };

  render() {
    const { label, count, activeCount, ...props } = this.props;
    const sanitizedCount = Math.max(count, 0);
    const sanitizedTotalCount = Math.max(activeCount, 0);

    return (
      <View {...props}>
        <Text>{label}</Text>
        {!!sanitizedCount && (
          <Text count>{sanitizedCount}</Text>
        )}

        {!!sanitizedTotalCount && (
          <Badge>
            <Text>{sanitizedTotalCount}</Text>
          </Badge>
        )}
      </View>
    );
  }
}
