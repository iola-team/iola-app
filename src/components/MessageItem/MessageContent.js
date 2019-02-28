import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View } from 'react-native';

import { withStyle } from '~theme';
import MessageStatus from './MessageStatus';
import MessageContentText from './MessageContentText';
import MessageContentImage from './MessageContentImage';

const messageFragment = gql`
  fragment MessageContent_message on Message {
    id
    createdAt
    content {
      ...MessageContentText_content
      ...MessageContentImage_content
    }
  }
  
  ${MessageContentText.fragments.content}
  ${MessageContentImage.fragments.content}
`;

@withStyle('Sparkle.MessageContent', {
  marginBottom: 5,
  borderRadius: 4,
  overflow: 'hidden',

  'Sparkle.ImageFit': {
    marginTop: 5,
  },

  'Sparkle.MessageStatus': {
    position: 'absolute',
    bottom: 10,
    right: 15,
    color: '#AFB2BF',

    '.inverse': {
      color: '#9B9EF4',
    },
  },

  '.first': {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  '.last': {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
            <MessageContentImage content={content} />
          ) : (
            <MessageContentText content={content} inverse={right} />
          )}
          <MessageStatus
            status={status}
            time={createdAt}
            hasStatus={right}
            inverse={right}
            isImage={!!content.image}
          />
        </View>
      </View>
    );
  }
}
