import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from 'theme';
import { ScreenHeader, UserAvatar } from 'components';

const userQuery = gql`
  query ChannelWithUserQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        name
      }

      ...UserAvatar_user
    }
  }

  ${UserAvatar.fragments.user}
`;

const chatQuery = gql`
  query ChannelWithChatQuery($chatId: ID!) {
    me {
      id
    }
    chat: node(id: $chatId) {
      id
      ...on Chat {
        id
        participants {
          id
          name

          ...UserAvatar_user
        }
      }
    }
  }

  ${UserAvatar.fragments.user}
`;

@graphql(userQuery, {
  name: 'userData',
  skip: props => !props.userId,
  options: ({ userId }) => ({
    variables: {
      userId,
    },
  }),
})
@graphql(chatQuery, {
  name: 'chatData',
  skip: props => !props.chatId,
  options: ({ chatId }) => ({
    variables: {
      chatId,
    },
  }),
})
@styleSheet('Sparkle.ChannelScreenHeader', {
  avatar: {
    marginHorizontal: 16,
  },
})
export default class ChannelHeader extends Component {

  getUser() {
    const { userData, chatData } = this.props;

    if (userData) {
      return userData.user;
    }

    if (!chatData || chatData.loading) {
      return null;
    }

    const { chat, me } = chatData;
    const [ user ] = chat.participants.filter(({ id }) => id !== me.id);

    return user;
  }

  renderRight() {
    const { styleSheet } = this.props;
    const user = this.getUser();

    return user && (
      <UserAvatar user={user} style={styleSheet.avatar} />
    );
  }

  render() {
    const user = this.getUser();
    const title = user && user.name || '';

    return (
      <ScreenHeader {...this.props} title={title} renderRight={::this.renderRight} />
    );
  }
}
