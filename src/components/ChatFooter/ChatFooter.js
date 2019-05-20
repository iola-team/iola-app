import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Item, Input } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Icon from '../Icon';
import TouchableOpacity from '../TouchableOpacity';

@styleSheet('Sparkle.ChatFooter', {
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  inputWrap: {
    borderWidth: 0,
    borderRadius: 8,
    flex: 1,
    marginLeft: 18,
    overflow: 'hidden',
  },

  input: {
    height: 40,
    paddingLeft: 15,
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
    onSend: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
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

    if (!text.length) return;

    onSend(text);
    this.setState({ text: '' });
  };

  render() {
    const { style, styleSheet: styles, disabled } = this.props;
    const { text } = this.state;

    return (
      <View style={[styles.root, style]}>
        <Item rounded style={styles.inputWrap}>
          <Input
            style={styles.input}
            disabled={disabled}
            placeholderTextColor="#AFB2BF" // TODO: Add theme variable support
            placeholder="Type Message"
            onChangeText={this.onChange}
            value={text}
          />
        </Item>
        <TouchableOpacity disabled={disabled} style={styles.sendButton} onPress={this.onSend}>
          <Icon style={styles.sendIcon} name="send-message" />
        </TouchableOpacity>
      </View>
    );
  }
}
