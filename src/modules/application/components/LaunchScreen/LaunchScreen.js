import React, { Component } from 'react';
import { Container, View, Text, Button } from 'native-base';
import styled from 'styled-components/native';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default class LaunchScreen extends Component {
  render() {
    const { startAuthentication, openMessenger } = this.props;

    return (
      <Container>
        <Wrap>
          <View>
            <Button onPress={openMessenger}>
              <Text>Launch App</Text>
            </Button>
          </View>
        </Wrap>
      </Container>
    );
  }
}