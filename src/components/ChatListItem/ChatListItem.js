import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { filter } from 'lodash';
import Moment from 'react-moment';
import { View, Text, Button, ListItem, Left, Body, Right, Badge } from 'native-base';

import { withStyle } from 'theme';
import UserAvatar from '../UserAvatar';
import MessageStateIndicator from '../MessageStateIndicator';

const chatFragment = gql`
  fragment ChatListItem_chat on Chat {
    id
    participants {
      id
      name
      ...UserAvatar_user
    }
    messages(last: 1) {
      totalCount
      edges {
        node {
          id
          createdAt
          content {
            text
          }
        }
      }
    }
  }
  
  ${UserAvatar.fragments.user}
`;

@withStyle('Sparkle.ChatListItem', {
  'NativeBase.ListItem': {
    'NativeBase.Right': {
      'Sparkle.MessageStateIndicator': {
        height: 20,
      },
    },
  },
})
export default class ChatListItem extends Component {
  static fragments = {
    chat: chatFragment,
  };

  static propTypes = {
    chat: fragmentProp(chatFragment).isRequired,
    currentUserId: PropTypes.string.isRequired,
  };

  static defaultProps = {

  };

  render() {
    const { style, styleSheet: styles, chat, currentUserId } = this.props;
    const { messages, participants } = chat;

    const recipient = filter(participants, ({ id }) => id !== currentUserId)[0];
    const lastMessage = messages.edges[0].node;

    return (
      <ListItem
        style={style}
        button
        avatar
        onPress={() => console.log('On press')}
      >
        <Left>
          <UserAvatar user={recipient} />
        </Left>
        <Body>
          <Text headline>{recipient.name}</Text>
          <Text note numberOfLines={1}>{lastMessage.content.text}</Text>
        </Body>
        <Right>
          <Moment headline time note element={Text} format="HH:mm">{lastMessage.createdAt}</Moment>
          {/*<Badge primary>*/}
            {/*<Text>2</Text>*/}
          {/*</Badge>*/}

          <MessageStateIndicator />
        </Right>
      </ListItem>
    );
  }
}
