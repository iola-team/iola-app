import React from 'react';
import { Container, View, Text } from 'native-base';
import styled from 'styled-components/native';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <Wrap>
      <View>
        <Text>Launch App</Text>
      </View>
    </Wrap>
  </Container>
);
