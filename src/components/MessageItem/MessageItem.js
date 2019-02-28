import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN } from 'react-native';

import { withStyle } from '~theme';
import MessageContent from './MessageContent';
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
  
  ${MessageContent.fragments.message}
  ${Avatar.fragments.user}
`;

@withStyle('Sparkle.MessageItem', {
  flexDirection: 'row',

  'Sparkle.UserAvatar': {
    marginLeft: -40,
  },

  '.hasAvatar': {
    paddingLeft: 56,
    paddingRight: 34,
  },

  '.right': {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingLeft: 56 + 34, // paddingLeft and paddingRight of .hasAvatar
  },

  '.last': {
    marginBottom: 15,
  },
})
export default class MessageItem extends Component {
  static fragments = {
    message: messageFragment,
  };

  static propTypes = {
    message: fragmentProp(messageFragment).isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    last: PropTypes.bool,
    first: PropTypes.bool,
    hasAvatar: PropTypes.bool,
  };

  static defaultProps = {
    left: false,
    right: false,
    last: false,
    first: false,
    hasAvatar: false,
  };

  render() {
    const { message, first, hasAvatar, style, ...props } = this.props;
    const showAvatar = hasAvatar && first;

    return (
      <ViewRN style={style}>
        {showAvatar && <Avatar size="small" user={message.user} />}
        <MessageContent message={message} first={first} {...props} />
      </ViewRN>
    );
  }
}
