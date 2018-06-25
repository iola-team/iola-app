import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import Status from './MessageStatus';
import TextContent from './TextContent';

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

  /**
   * Returns message content component, detected from props
   *
   * @returns Component
   */
  getContentComponent() {
    return TextContent;
  }

  render() {
    const { message, style, right } = this.props;
    const contentProps = {
      content: message.content,
      inverse: right,
      statusComponent: (<Status time={message.createdAt} hasStatus={right} />),
    };

    const Content = this.getContentComponent();

    return (
      <ViewRN style={style}>
        <Content {...contentProps} />
      </ViewRN>
    );
  }
}
