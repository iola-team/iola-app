import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { ScreenHeader, UserAvatar } from 'components';
import ChannelHeader from './ChannelHeader';
import { Chat } from 'components';

const propsToVariables = props => ({
  userId: props.navigation.state.params.userId,
});

@graphql(gql`
  query ChannelWithUserQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...UserAvatar_user
    }
  }

  ${UserAvatar.fragments.user}
`, {
  options: props => ({
    variables: propsToVariables(props),
  }),
})
@styleSheet('Sparkle.ChannelScreen')
export default class Channel extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Channel',
    header: props => (
      <ChannelHeader
        {...props}
        userId={navigation.state.params.userId}
      />
    ),
  });

  render() {
    return (
      <Container>
        <Chat chatId="Chat:68" />
      </Container>
    );
  }
}
