import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import { withStyle } from 'theme';

const messageFragment = gql`
  fragment MessageTextContent_message on Message {
    id
    content
  }
`;

@withStyle('Sparkle.MessageTextContent', {
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 15,
  paddingVertical: 10,
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',

  'Sparkle.MessageStatus': {
    paddingLeft: 10,
    marginLeft: 'auto',
  },

  '.inverse': {
    backgroundColor: '#5F96F2',

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
})
export default class TextContent extends Component {
  static fragments = {
    message: messageFragment,
  }

  static propTypes = {
    statusComponent: PropTypes.element.isRequired,
    message: fragmentProp(messageFragment).isRequired,
  };

  render() {
    const { message, style, statusComponent } = this.props;

    return (
      <View style={style}>
        <Text>{message.content}</Text>
        {statusComponent}
      </View>
    );
  }
}
