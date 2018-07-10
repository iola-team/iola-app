import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';

export default class Channels extends Component {
  static navigationOptions = {
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="ios-chatbubbles-outline" style={{ color: tintColor }} />
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
