import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import styled from 'styled-components/native';
import {
  Container,
  Spinner,
  Header,
  Button,
  Left,
  Icon,
  Body,
  Right,
  Title,
  View
} from 'native-base';

import Chat from '../Chat';

const Wrapper = styled(View)`
  flex: 1;
`;

export default class ChannelScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  renderChat() {
    const {
      channel
    } = this.props;

    return (
      <Chat channelId={channel.id} />
    )
  }

  render() {
    const {
      loading,
      channel,
      navigation
    } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.goBack(null)}>
              <Icon name="arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>
              {
                channel && channel.recipients.map(({ name }) => name).join(', ')
              }
            </Title>
          </Body>

          <Right/>
        </Header>
        <Wrapper>
          {
            loading || !channel ? (
              <Spinner color='blue' />
            ) : this.renderChat()
          }
        </Wrapper>
      </Container>
    );
  }
}