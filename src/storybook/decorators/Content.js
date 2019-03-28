import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content } from 'native-base';

export default ({ padder = false, centered = false, backgroundColor } = {}) => (story) => (
  <Container>
    <SafeAreaView style={{ flex: 1 }}>
      <Content
        padder={padder}
        contentContainerStyle={centered ? {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
        } : { backgroundColor }}
      >
        {story()}
      </Content>
    </SafeAreaView>
  </Container>
);
