import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, Text, Button } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

const chatFragment = gql`
  fragment ChatItem_chat on Chat {
    id
    participants {
      id
      name
      avatar {
        id
        url
      }
    }
    messages(last: 1) {
      totalCount
      edges {
        node {
          id
          content {
            text
          }
        }
      }
    }
  }
`;

@styleSheet('Sparkle.ChatItem', {
  root: {

  }
})
export default class ChatItem extends Component {
  static fragments = {
    chat: chatFragment,
  };

  static propTypes = {
    chat: fragmentProp(chatFragment).isRequired,
  };

  static defaultProps = {

  };

  render() {
    const { style, styleSheet: styles, chat } = this.props;

    console.log('Chat', chat);

    return (
      <View style={[styles.root, style]}>
          <Text>Hello ChatItem!</Text>
      </View>
    );
  }
}
