import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';

export default class Dashboard extends Component {
  static navigationOptions = {
    title: "Dashboard",
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor }}
        name={"ios-settings-outline"}
      />
    ),
  };

  render() {
    return (
      <Container>
        <Content padder>
          <Text>Dashboard</Text>
        </Content>
      </Container>
    );
  }
}
