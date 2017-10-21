import React, { Component } from 'react';
import { uniqueId, reverse } from 'lodash';
import { GiftedChat } from 'react-native-gifted-chat';
import { gql } from 'react-apollo'
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';

const withId = object => ({
  _id: object.id,
  ...object
});

const userFragment = gql`
  fragment Chat_user on User {
    id
    name
  }
`;

const messageFragment = gql`
  fragment Chat_message on Message {
    id
    text
    user {
      ...Chat_user
    }
  }

  ${userFragment}
`;

export default class Chat extends Component {
  static fragments = {
    user: userFragment,
    message: messageFragment
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    messages: PropTypes.arrayOf(fragmentProp(messageFragment))
  };

  render() {
    const {
      messages = [],
      user,
      onSend
    } = this.props;

    const messagesWithId = messages.map(withId).map(({ user, ...message }) => ({
      ...message,
      user: withId(user)
    }));

    return (
      <GiftedChat messages={messagesWithId}
                  onSend={onSend}
                  user={withId(user)}
      />
    );
  }
}