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
    messages(first: 1) {
      edges {
        node {
          id
          status
          createdAt
          content {
            text
          }
          user {
            id
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
        marginTop: 3,
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
    unreadMessagesCount: PropTypes.number,
    currentUserId: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => {},
    unreadMessagesCount: 0,
  };

  renderStatus(message, unreadCount) {
    const { currentUserId } = this.props;

    if (!unreadCount && currentUserId !== message.user.id) {
      return null;
    }

    return unreadCount ? (
      <Badge primary>
        <Text>{unreadCount}</Text>
      </Badge>
    ) : (
      <MessageStateIndicator done={message.status === 'READ'} />
    );
  }

  render() {
    const {
      style,
      styleSheet: styles,
      chat,
      currentUserId,
      unreadMessagesCount,
      onPress,
    } = this.props;
    const { messages, participants } = chat;

    const recipient = filter(participants, ({ id }) => id !== currentUserId)[0];
    const lastMessage = messages.edges[0].node;

    return (
      <ListItem
        style={style}
        button
        avatar
        onPress={onPress}
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

          {this.renderStatus(lastMessage, unreadMessagesCount)}
        </Right>
      </ListItem>
    );
  }
}
