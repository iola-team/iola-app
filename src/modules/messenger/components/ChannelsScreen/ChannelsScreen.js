import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Icon,
  Right,
  Button,
  List,
  Spinner
} from 'native-base';

import ChannelItem from '../ChannelItem';

export default class ChannelsScreen extends Component {
  componentWillReceiveProps({ screenProps }) {
    const { navigation, data } = this.props;

    if (screenProps.currentState.key === navigation.state.key) {
      data.refetch();
    }
  }

  shouldComponentUpdate() {
    return this.isFocused();
  }

  isFocused() {
    return this.props.screenProps.currentState.key === this.props.navigation.state.key;
  }

  render() {

    const {
      navigation,
      showChannelCreation,
      openChannel,
      data: {
        loading,
        allChannels: channels = []
      }
    } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>

          <Body>
            <Title>Chats</Title>
          </Body>

          <Right>
            <Button
              transparent
              onPress={() => showChannelCreation()}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <Content>
          {
            loading && !channels.length ? (
              <Spinner color='blue' />
            ) : (
              <List>
                {
                  channels.map(channel => (
                    <ChannelItem key={channel.id} channel={channel} onPress={openChannel} />
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