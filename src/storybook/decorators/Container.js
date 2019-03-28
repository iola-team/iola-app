import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, View } from 'native-base';

export default ({ padder = false, backgroundColor, style = {} } = {}) => (story) => (
  <Container>
    <SafeAreaView style={{ flex: 1 }}>
      <View
        padder={padder}
        style={{
          flex: 1,
          backgroundColor,
          ...style,
        }}
      >
        {story()}
      </View>
    </SafeAreaView>
  </Container>
);
