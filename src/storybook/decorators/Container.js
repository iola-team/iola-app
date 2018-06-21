import React from 'react';
import {
  Container,
  View,
} from 'native-base';

export default ({ padder = false, backgroundColor } = {}) => (story) => (
  <Container>
    <View padder={padder} style={{
      flex: 1,
      backgroundColor,
    }}>
      {story()}
    </View>
  </Container>
);
