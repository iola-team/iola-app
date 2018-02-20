import React, { Component } from 'react';
import { Container, View, Text, Button } from 'native-base';
import styled from 'styled-components/native';

import { USER } from '../roteNames';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Padder = styled(View)`
  padding: 10px;
`;

export default (props) => {
  const { increment, count, navigation: { navigate } } = props;

  return (
    <Container>
      <Wrap>
        <View>
          <Text>Hello World: {count}</Text>
          <Padder>
            <Button onPress={() => increment(1)}>
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
}
