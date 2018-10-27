import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import Status from './MessageStatus';
import Content from './MessageContent';
import Avatar from '../UserAvatar';

const messageFragment = gql`
  fragment MessageItem_message on Message {
    id
    user {
      id
      ...UserAvatar_user
    }
    status
    ...MessageContent_message
  }
  
  ${Content.fragments.message}
  ${Avatar.fragments.user}
`;

@withStyle('Sparkle.MessageItem', {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginBottom: 5,
  width: '90%',
  marginHorizontal: 10,

  'NativeBase.Thumbnail': {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  '.last': {
    marginBottom: 15,
  },

  '.hasAvatar': {
    paddingLeft: 50,
  },

  '.right': {
    width: '80%',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',

    '.hasAvatar': {
      paddingRight: 50,
      paddingLeft: 0,
    },

    'NativeBase.Thumbnail': {
      left: null,
      right: 0,
    },
  },
})
export default class MessageItem extends Component {
  static fragments = {
    message: messageFragment,
  }

  static propTypes = {
    message: fragmentProp(messageFragment).isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    last: PropTypes.bool,
    first: PropTypes.bool,
    hasAvatar: PropTypes.bool,
  };

  static defaultProps = {

  };

  render() {
    const { message, first, hasAvatar, style, ...props } = this.props;
    const showAvatar = hasAvatar && first;

    return (
      <ViewRN style={style}>
        {showAvatar && <Avatar user={message.user} />}
        <Content
          message={message}
          first={first}
          {...props}
        />
      </ViewRN>
    );
  }
}
