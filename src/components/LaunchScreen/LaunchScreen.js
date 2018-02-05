import React from 'react';
import { Container, View, Text, Button } from 'native-base';
import styled from 'styled-components/native';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default ({ counter, incrementCounter }) => (
  <Container>
    <Wrap>
      <View>
        <Text>Hello World {counter}</Text>
        <Button onPress={incrementCounter}>
          <Text>+</Text>
        </Button>
      </View>
    </Wrap>
  </Container>
);
