import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

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

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.MessageItem', {
  root: {

  }
})
export default class MessageItem extends PureComponent {
  static fragments = {
    message: messageFragment,
  }

  static propTypes = {
    message: fragmentProp(messageFragment).isRequired,
  };

  static defaultProps = {

  };

  render() {
    const { message, style } = this.props;

    return (
      <Root style={style}>
        <Text>{message.content}</Text>
      </Root>
    );
  }
}
