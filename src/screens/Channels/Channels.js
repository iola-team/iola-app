import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Text,
  Icon
} from 'native-base';

export default class Channels extends Component {
  static navigationOptions = {
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor }}
        name={'ios-chatbubbles-outline'}
      />
    ),
  };

  render() {
    return (
      <Container>
        <Header noShadow>
          <Body>
            <Title>Chats</Title>
          </Body>
        </Header>
        <Content padder>
          <Text>Channels</Text>
        </Content>
      </Container>
    );
  }
}
