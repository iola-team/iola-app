import React from 'react';
import { View } from 'native-base';

export default (borderColor = '#FF0000') => (story) => (
  <View style={{
    borderWidth: 1,
    borderColor,
  }}>
    {story()}
  </View>
);
