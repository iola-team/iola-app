import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import Status from './MessageStatus';

const messageFragment = gql`
  fragment MessageItem_message on Message {
    id
    content
    createdAt
    user {
      id
      name
      avatar {
        id
        url
      }
    }
  }
`;

@withStyle('Sparkle.MessageItem', {
  borderWidth: StyleSheet.hairlineWidth,
  borderRadius: 8,
  borderColor: '#BDC0CB',
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 15,
  paddingVertical: 10,
  maxWidth: '80%',
  alignItems: 'center',
  alignSelf: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',

  'Sparkle.MessageStatus': {
    paddingLeft: 10,
    marginLeft: 'auto',
  },

  '.left': {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },

  '.right': {
    alignSelf: 'flex-end',
    backgroundColor: '#5F96F2',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,

    'NativeBase.Text': {
      color: '#FFFFFF',
    },

    'Sparkle.MessageStatus': {
      'NativeBase.Icon': {
        color: '#A3C5FF',
      },

      'NativeBase.Text': {
        color: '#A3C5FF',
      },
    },
  },

  '.first': {
    '.left': {
      borderTopLeftRadius: 8,
    },

    '.right': {
      borderTopRightRadius: 8,
    },
  },

  '.last': {
    '.left': {
      borderBottomLeftRadius: 8,
    },

    '.right': {
      borderBottomRightRadius: 8,
    },
  },
})
export default class MessageItem extends PureComponent {
  static fragments = {
    message: messageFragment,
  }

  static propTypes = {
    message: fragmentProp(messageFragment).isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    last: PropTypes.bool,
    first: PropTypes.bool,
  };

  static defaultProps = {

  };

  render() {
    const { message, style, right } = this.props;

    return (
      <ViewRN style={style}>
        <Text>{message.content}</Text>
        <Status time={message.createdAt} hasStatus={right} />
      </ViewRN>
    );
  }
}
