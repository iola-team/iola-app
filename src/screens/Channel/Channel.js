import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Container,
  Content,
  Text,
  Icon,
  View,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { ScreenHeader, UserAvatar } from 'components';
import ChannelHeader from './ChannelHeader';
import { Chat } from 'components';

const propsToVariables = props => ({
  userId: props.navigation.state.params.userId,
  chatId: props.navigation.state.params.chatId,
});

@styleSheet('Sparkle.ChannelScreen')
export default class Channel extends Component {
  static navigationOptions = (navigationProps) => ({
    title: 'Channel',
    header: props => (
      <ChannelHeader
        {...props}
        {...propsToVariables(navigationProps)}
      />
    )
  });

  render() {
    const { chatId, userId } = propsToVariables(this.props);

    return (
      <Container>
        <Chat chatId={chatId} recipientId={userId} />
      </Container>
    );
  }
}
