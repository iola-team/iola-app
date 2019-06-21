import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN } from 'react-native';
import { View } from 'native-base';

import { withStyle } from '~theme';
import MessageContent from './MessageContent';
import Avatar from '../UserAvatar';
import Placeholder from '../Placeholder';

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
    marginLeft: -48,
    marginRight: 8,
  },

  '.hasAvatar': {
    paddingLeft: 48,
    paddingRight: 34,
  },

  '.right': {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingLeft: 48 + 34, // paddingLeft and paddingRight of .hasAvatar
  },

  '.last': {
    marginBottom: 15,
  },

  'Sparkle.Placeholder': {
    flexDirection: 'row',
    marginBottom: 15,

    'NativeBase.ViewNB': {
      borderRadius: 16,

      '.avatar': {
        height: 40,
        width: 40,

        marginRight: 8,
        borderRadius: 8,
      },

      '.content': {
        width: '60%',
        height: 46,
      },
    },

    '.rightSide': {
      flexDirection: 'row-reverse',

      'NativeBase.ViewNB': {
        '.content': {
          height: 90,
          width: '80%',
        },
      },
    },
  },
})
export default class MessageItem extends Component {
  static fragments = {
    message: messageFragment,
  };

  static propTypes = {
    message: fragmentProp(messageFragment),
    left: PropTypes.bool,
    right: PropTypes.bool,
    last: PropTypes.bool,
    first: PropTypes.bool,
    hasAvatar: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
    message: null,
    left: false,
    right: false,
    last: false,
    first: false,
    hasAvatar: false,
  };

  renderPlaceholder() {
    const { hasAvatar, left, right } = this.props;

    return (
      <Placeholder rightSide={right} leftSide={left}>
        {hasAvatar && !right && <View avatar />}
        <View content />
      </Placeholder>
    );
  }
  
  render() {
    const { message, first, hasAvatar, style, loading, ...props } = this.props;
    const showAvatar = hasAvatar && first;

    if (loading && !message) {
      return this.renderPlaceholder();
    }

    return (
      <ViewRN style={style}>
        {showAvatar && <Avatar size="medium" user={message.user} />}
        <MessageContent message={message} first={first} {...props} />
      </ViewRN>
    );
  }
}
