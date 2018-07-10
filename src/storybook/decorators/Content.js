import React from 'react';
import {
  Container,
  Content,
} from 'native-base';

export default ({ padder = false, centered = false, backgroundColor } = {}) => (story) => (
  <Container>
    <Content padder={padder} contentContainerStyle={centered ? {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
    } : { backgroundColor }}>
      {story()}
    </Content>
  </Container>
);
