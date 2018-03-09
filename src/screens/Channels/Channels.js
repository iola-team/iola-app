import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';

export default class Channels extends Component {
  static navigationOptions = {
    title: "Channels",
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor }}
        name={"ios-chatbubbles-outline"}
      />
    ),
  };

  render() {
    return (
      <Container>
        <Content padder>
          <Text>Channels</Text>
        </Content>
      </Container>
    );
  }
}
