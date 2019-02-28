import React, { Component } from 'react';
import { Container } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { ChatList, Icon, SearchBar, TouchableOpacity } from 'components';
import { CHANNEL } from '../routeNames';

@graphql(gql`
  query ChannelsQuery {
    me {
      id
    }
  }
`)
export default class Channels extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="chats-bar" style={{ color: tintColor, fontSize: 20 }} />
    ),
  });

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(CHANNEL, { chatId: node.id });
  };

  render() {
    const { data: { me } } = this.props;

    return (
      <Container>
        <ChatList userId={me?.id} onItemPress={this.onItemPress} />
      </Container>
    );
  }
}
