import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, ListItem, Left, Body, Right, Badge, View } from 'native-base';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { filter } from 'lodash';
import Moment from 'react-moment';

import { withStyle } from '~theme';
import UserAvatar from '../UserAvatar';
import MessageStateIndicator from '../MessageStateIndicator';
import Placeholder from '../Placeholder';

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
        marginTop: 5,
        marginRight: 3,
      },
    },
  },

  'Sparkle.Placeholder': {
    'NativeBase.ListItem': {
      'NativeBase.Left': {
        'NativeBase.ViewNB': {
          height: 40,
          width: 40,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
        },
      },

      'NativeBase.Body': {
        'NativeBase.Text': {
          lineHeight: 15,
          borderRadius: 4,
          marginRight: 20,
          backgroundColor: '#FFFFFF',

          '.headline': {
            marginTop: 3,
            width: '50%',
          },
        },
      },
    },
  },
})
export default class ChatListItem extends Component {
  static fragments = {
    chat: chatFragment,
  };

  static propTypes = {
    chat: fragmentProp(chatFragment),
    currentUserId: PropTypes.string,
    unreadMessagesCount: PropTypes.number,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    chat: null,
    currentUserId: null,
    unreadMessagesCount: 0,
    onPress: () => {},
  };

  renderStatus(message, unreadCount) {
    const { currentUserId } = this.props;

    if (!unreadCount && currentUserId !== message.user.id) {
      return null;
    }

    return unreadCount ? (
      <Badge>
        <Text>{unreadCount}</Text>
      </Badge>
    ) : (
      <MessageStateIndicator done={message.status === 'READ'} />
    );
  }

  renderPlaceholder() {
    const { style } = this.props;

    return (
      <Placeholder style={style}>
        <ListItem avatar noBorder>
          <Left>
            <View />
          </Left>
          <Body>
            <Text headline>{" "}</Text>
            <Text content>{" "}</Text>
          </Body>
        </ListItem>
      </Placeholder>
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

    if (!chat) {
      return this.renderPlaceholder();
    }

    const { messages, participants } = chat;
    const [ recipient = participants[0] ] = filter(participants, ({ id }) => id !== currentUserId);
    const lastMessage = messages.edges[0].node;

    return (
      <ListItem style={style} button avatar chatItem onPress={onPress}>
        <Left>
          <UserAvatar user={recipient} />
        </Left>
        <Body>
          <Text name headline>{recipient.name}</Text>
          <Text content numberOfLines={1}>{lastMessage.content.text}</Text>
        </Body>
        <Right>
          <Moment element={Text} format="HH:mm">{lastMessage.createdAt}</Moment>
          {this.renderStatus(lastMessage, unreadMessagesCount)}
        </Right>
      </ListItem>
    );
  }
}
