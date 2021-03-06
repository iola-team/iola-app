import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, ListItem, Left, Body, Right, Badge, View } from 'native-base';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { filter } from 'lodash';
import { onlyUpdateForKeys, hoistStatics } from 'recompose';
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

@withStyle('iola.ChatListItem', {
  'NativeBase.ListItem': {
    'NativeBase.Right': {
      'iola.MessageStateIndicator': {
        marginTop: 5,
        marginRight: 3,
      },
    },
  },

  'iola.Placeholder': {
    'NativeBase.ListItem': {
      height: 72,

      'NativeBase.Left': {
        'NativeBase.ViewNB': {
          height: 40,
          width: 40,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
        },
      },

      'NativeBase.Body': {
        'NativeBase.ViewNB': {
          height: 16,
          overflow: 'hidden',
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          marginRight: 16,
          marginTop: 3,
          marginBottom: 3,

          '.headline': {
            height: 20,
            width: '50%',
          },
        },
      },
    },
  },
})
@hoistStatics(onlyUpdateForKeys([
  'chat', 'last', 'unreadMessagesCount', 'currentUserId', 'style'
]))
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
            <View headline />
            <View content />
          </Body>
        </ListItem>
      </Placeholder>
    );
  }

  onPress = () => requestAnimationFrame(() => {
    const { onPress, chat } = this.props;

    return onPress(chat);
  });

  render() {
    const {
      style,
      styleSheet: styles,
      chat,
      currentUserId,
      unreadMessagesCount,
      ...props
    } = this.props;

    if (!chat) {
      return this.renderPlaceholder();
    }

    const { messages, participants } = chat;
    const lastMessage = messages.edges[0].node;
    const [ recipient = participants[0] ] = filter(participants, participant => (
      participant?.id !== currentUserId)
    );

    return (
      <ListItem {...props} button avatar chatItem style={style} onPress={this.onPress}>
        <Left>
          <UserAvatar user={recipient} />
        </Left>
        <Body>
          <Text name headline>{recipient?.name || 'Deleted User'}</Text>
          <Text content secondary numberOfLines={1}>{lastMessage.content.text}</Text>
        </Body>
        <Right>
          <Moment secondary element={Text} format="HH:mm">{lastMessage.createdAt}</Moment>
          {this.renderStatus(lastMessage, unreadMessagesCount)}
        </Right>
      </ListItem>
    );
  }
}
