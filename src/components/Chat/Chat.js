import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import MessageList from '../MessageList';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

const userFragment = gql`
  fragment Chat_user on User {
    id
    name
  }
`;

const chatFragment = gql`
  fragment Chat_chat on Chat {
    id
    user {
      name
    }
    participants {
      id
      name
    }
    messages {
      totalCount
      edges {
        ...MessageList_edge
      }
    }
  }
  
  ${MessageList.fragments.edge}
`;

@styleSheet('Sparkle.Chat')
export default class Chat extends Component {
  static fragments = {
    user: userFragment,
    chat: chatFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    chat: fragmentProp(chatFragment).isRequired,
  };

  static defaultProps = {

  };

  render() {
    const { style, user, chat } = this.props;
    console.log('Chat', chat);

    return (
      <View style={style}>
        <MessageList
          edges={chat.messages.edges}
        />
      </View>
    );
  }
}
