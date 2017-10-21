import React from "react";
import { Image } from "react-native";
import styled from 'styled-components/native';
import {
  Container,
  Content,
  Text,
  View,
  Button,
  List,
  ListItem,
  Icon,
  Body,
  Left
} from "native-base";

import avatarImage from './avatar.jpg';

const Avatar = styled(Image)`
  width: 150px;
  height: 150px;
  border-radius: 150px;
  margin-bottom: 10px;
`;

const Wrapper = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Head = styled(View)`
  align-items: center;
  flex: 2;
  padding: 10px;
`;

const Middle = styled(View)`
  flex: 4;
`;

const Bottom = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 0px 20px;
`;

export default class Sidebar extends React.Component {
  render() {
    const { user, loading, signOut } = this.props;

    return (
      <Container>
        <Wrapper>
          <Head>
            <Avatar source={avatarImage} />
            <Text>{ user && user.name }</Text>
          </Head>

          <Middle>
            <List>
              <ListItem icon last>
                <Left>
                  <Icon name="chatboxes" />
                </Left>
                <Body>
                  <Text>Channels</Text>
                </Body>
              </ListItem>
            </List>

          </Middle>
          <Bottom>
            <Button block bordered onPress={signOut}>
              <Text>Sign out</Text>
            </Button>
          </Bottom>
        </Wrapper>
      </Container>
    );
  }
}
