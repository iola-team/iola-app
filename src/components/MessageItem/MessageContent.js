import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View } from 'react-native';

import { withStyle } from 'theme';
import MessageStatus from './MessageStatus';
import TextContent from './TextContent';
import ImageFit from '../ImageFit';

const messageFragment = gql`
  fragment MessageContent_message on Message {
    id
    createdAt
    content {
      ...MessageTextContent_content
    }
  }
  
  ${TextContent.fragments.content}
`;

@withStyle('Sparkle.MessageContent', {
  borderRadius: 8,
  overflow: 'hidden',
  elevation: 0.5,

  'Sparkle.ImageFit': {
    marginTop: 6,
    marginBottom: 13,
  },

  'Sparkle.MessageStatus': {
    position: 'absolute'
  },

  '.inverse': {
    'Sparkle.MessageStatus': {
      color: '#A3C5FF',
    },
  },

  '.left': {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },

  '.right': {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
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
export default class MessageContent extends PureComponent {
  static fragments = {
    message: messageFragment,
  };

  static propTypes = {
    message: fragmentProp(messageFragment).isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    last: PropTypes.bool,
    first: PropTypes.bool,
  };

  static defaultProps = {
    left: false,
    right: false,
    last: false,
    first: false,
  };

  render() {
    const { message: { content, createdAt, status }, style, right } = this.props;

    return (
      <View style={style}>
        <View>
          {content.image ? (
            <ImageFit url={content.image} maxHeight={170} maxWidth={200} />
          ) : (
            <TextContent
              content={content}
              // inverse={right}
              // statusComponent={<MessageStatus status={status} time={createdAt} hasStatus={right} />}
            />
          )}
          <MessageStatus status={status} time={createdAt} hasStatus={right} />
        </View>
      </View>
    );
  }
}
