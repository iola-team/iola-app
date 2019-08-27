import React, { Component } from 'react';
import { View } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { ScreenHeader, UserAvatar } from '~components';
import { USER } from '../routeNames';

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
@styleSheet('iola.ChannelScreenHeader', {
  avatar: {
    marginHorizontal: 16,
  },
})
export default class ChannelHeader extends Component {
  getUser() {
    const { userData, chatData: { me, chat } = {} } = this.props;

    if (userData) {
      return userData.user;
    }

    const [ user ] = chat?.participants.filter((participant) => participant?.id !== me.id) || [];

    return user === undefined ? chat?.participants[0] : user;
  }

  renderRight = () => {
    const { styleSheet, navigation } = this.props;
    const user = this.getUser();

    return (
      <View style={styleSheet.avatar}>
        <UserAvatar
          foreground
          user={user}
          onPress={user && (
            () => navigation.navigate(USER, { id: user.id })
          )}
        />
      </View>
    );
  };

  render() {
    const user = this.getUser();
    const title = user?.name || 'Deleted User';

    return (
      <ScreenHeader {...this.props} title={title} renderRight={this.renderRight} />
    );
  }
}
