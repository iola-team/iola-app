import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';

export default class Contacts extends Component {
  static navigationOptions = {
    title: "Users",
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor, fontSize: 35 }}
        name={"ios-people-outline"}
      />
    ),
  };

  render() {
    return (
      <Container>
        <Content padder>
          <Text>Contacts</Text>
        </Content>
      </Container>
    );
  }
}
