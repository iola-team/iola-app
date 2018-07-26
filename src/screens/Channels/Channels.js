import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import * as routes from '../roteNames'
import { ChatList } from 'components';

@graphql(gql`
  query {
    me {
      id
      
      ...ChatList_user
    }
  }
  
  ${ChatList.fragments.user}
`)
export default class Channels extends Component {
  static navigationOptions = {
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="ios-chatbubbles-outline" style={{ color: tintColor }} />
    ),
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(routes.CHANNEL, {
      chatId: node.id,
    });
  };

  render() {
    const { data: { me, loading } } = this.props;

    return (
      <Container>
        {!loading && (
          <ChatList
            user={me}
            onItemPress={this.onItemPress}
          />
        )}
      </Container>
    );
  }
}
