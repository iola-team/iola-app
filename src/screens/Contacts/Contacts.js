import React, { Component } from 'react';
import { Container, Content, Icon, List, ListItem, Thumbnail, Text, Body, Right, Left } from 'native-base';

export default class Contacts extends Component {
  static navigationOptions = {
    title: 'Users',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor, fontSize: 35 }}
        name={'ios-people-outline'}
      />
    ),
  };

  render() {
    const { data: { users, loading } } = this.props;

    return (
      <Container>
        <Content>
          <List>
            {
              users && users.map(user => (
                <ListItem key={user.id} avatar>
                  <Left>
                    <Thumbnail square source={{ uri: user.avatar.url }} />
                  </Left>
                  <Body>
                    <Text>{user.name}</Text>
                    <Text note>{" "}</Text>
                  </Body>
                  <Right>
                    <Text note>3:43 pm</Text>
                  </Right>
                </ListItem>
              ))
            }
          </List>
        </Content>
      </Container>
    );
  }
}
