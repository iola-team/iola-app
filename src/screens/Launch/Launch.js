import React from 'react';
import { Container, View, Text, Button } from 'native-base';
import styled from 'styled-components/native';

import { USER } from '../../router';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Padder = styled(View)`
  padding: 10px;
`;

export default ({ counter, incrementCounter, navigation: { navigate } }) => (
  <Container>
    <Wrap>
      <View>
        <Text>Hello World: {counter}</Text>
        <Padder>
          <Button onPress={incrementCounter}>
            <Text>+</Text>
          </Button>
        </Padder>

        <Padder>
          <Button onPress={() => navigate(USER, { id: 'cj6jd78alka9o0111x41jhjex' })}>
            <Text>Show user</Text>
          </Button>
        </Padder>
      </View>
    </Wrap>
  </Container>
);
