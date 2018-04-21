import React from 'react';
import { View } from 'native-base';

export default (style = {}) => (story) => (
  <View style={style}>
    {story()}
  </View>
);
