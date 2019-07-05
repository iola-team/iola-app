import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Item, Input } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Icon from '../Icon';
import TouchableOpacity from '../TouchableOpacity';

@styleSheet('Sparkle.ChatFooter', {
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },

  inputWrap: {
    borderWidth: 0,
    borderRadius: 8,
    flex: 1,
    marginLeft: 18,
    overflow: 'hidden',
  },

  input: {
    minHeight: 48,
    lineHeight: 18,
    paddingLeft: 15,

    ...Platform.select({
      ios: {
        paddingVertical: 13,
      },
      default: {},
    }),
  },

  sendButton: {
    height: 48,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },

  sendIcon: {
    fontSize: 28,
  },
})
export default class ChatFooter extends PureComponent {
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
      <SafeAreaView style={[styles.root, style]}>
        <Item rounded style={styles.inputWrap}>
          <Input
            multiline
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
      </SafeAreaView>
    );
  }
}
