import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Item,
  Input,
  Icon,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import Button from '../TouchableOpacity';

@styleSheet('Sparkle.ChatFooter', {
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  input: {
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
    height: 40,
    flex: 1,
    marginLeft: 18,
  },

  sendButton: {
    padding: 18,
  },

  sendIcon: {
    color: '#BDC0CB',
    fontSize: 30,
  },
})
export default class ChatFooter extends Component {
  static propTypes = {
    onSend: PropTypes.func,
  };

  state = {
    text: '',
  };

  onChange = (text) => {
    this.setState({ text });
  };

  onSend = () => {
    const { text } = this.state;
    const { onSend } = this.props;

    onSend(text);
  };

  render() {
    const { style, styleSheet: styles, onSend } = this.props;
    const { text } = this.state;

    return (
      <View style={[styles.root, style]}>
        <Item rounded style={styles.input}>
          <Input placeholder="Type Message" onChangeText={this.onChange} value={text} />
        </Item>
        <Button style={styles.sendButton} onPress={onSend}>
          <Icon style={styles.sendIcon} name="md-send" />
        </Button>
      </View>
    );
  }
}
