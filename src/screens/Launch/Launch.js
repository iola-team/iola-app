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

export default class extends Component {

  state = {
    counter: 0,
  }

  increment() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    const { navigation: { navigate } } = this.props;

    return (
      <Container>
        <Wrap>
          <View>
            <Text>Hello World: {this.state.counter}</Text>
            <Padder>
              <Button onPress={::this.increment}>
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
}
