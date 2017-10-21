import React, { Component } from 'react';
import styled from 'styled-components/native';

import {
  Spinner,
  Container,
  Content,
  Header,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Icon,
  View,
  Text,
  Button,
  Item,
  Input
} from 'native-base';

import defaultAvatar from './defaultAvatar.jpg';

const HeaderItem = styled(Item)`
  align-items: center;
`;

const HeaderButton = styled(Button)`
  align-self: center;
`;

const SearchInput = styled(Input)`
  height: 50px;
`;

export default class UsersScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const {
      navigation,
      searchUsers,
      searchPhrase,
      createChannel,
      data: {
        loading,
        allUsers = []
      }
    } = this.props;

    return (
      <Container>
        <Header searchBar>
          <HeaderItem>
            <HeaderButton iconLeft small transparent onPress={() => navigation.goBack(null)}>
              <Icon name="arrow-back" />
            </HeaderButton>

            <SearchInput placeholder="Search users"
                         value={searchPhrase}
                         onChangeText={searchUsers}
            />

            <Icon name="ios-people" />
          </HeaderItem>
        </Header>
        <Content>
          {
            loading && !allUsers.length ? (
              <Spinner color='blue' />
            ) : (
              <List>
                {
                  allUsers.map(user => (
                    <ListItem avatar button key={user.id} onPress={() => {
                      createChannel('cj6jd7fk2kver0124unux3co3', [user.id]);
                    }}>
                      <Left>
                        <Thumbnail source={defaultAvatar} />
                      </Left>

                      <Body>
                        <Text>{user.name}</Text>
                        <Text note>{user.email}</Text>
                      </Body>
                    </ListItem>
                  ))
                }
              </List>
            )
          }
        </Content>
      </Container>
    );
  }
}