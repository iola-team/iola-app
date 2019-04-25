import React, { Component } from 'react';
import { Container } from 'native-base';

import { Chat, KeyboardAvoidingView } from '~components';
import { withStyleSheet as styleSheet } from '~theme';
import ChannelHeader from './ChannelHeader';

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
    ),
  });

  render() {
    const { chatId, userId } = propsToVariables(this.props);

    return (
      <Container>
        <KeyboardAvoidingView>
          <Chat chatId={chatId} recipientId={userId} contentInset={{ bottom: 0 }} />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
