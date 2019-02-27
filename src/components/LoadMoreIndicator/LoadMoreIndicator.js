import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from '~theme';

@withStyle('Sparkle.LoadMoreIndicator', {
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,

  'NativeBase.Text': {
    fontSize: 14,
  }
})
export default class LoadMoreIndicator extends PureComponent {
  render() {
    const { style, time } = this.props;

    return (
      <View style={style}>
        <Text>Loading...</Text>
      </View>
    );
  }
}
