import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Text, Toast } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const Code = connectToStyleSheet('code', CodeInput).withProps(({ compareWithCode, onFulfill }) => ({
  compareWithCode,
  onFulfill,
  autoFocus: true,
  ignoreCase: true,
  secureTextEntry: false,
  inputPosition: 'center',
}));
const ResendButtonText = connectToStyleSheet('resendButtonText', Text);
const ResendButton = connectToStyleSheet('resendButton', Button);

@styleSheet('Sparkle.ForgotPasswordForm', {
  code: {
    width: 40,
    height: 64,
    borderRadius: 8,
    textAlign: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    color: '#585A61',
    fontFamily: 'SF Pro Text',
    fontSize: 24,
    fontWeight: '600',
  },

  activeColor: 'red',
  inactiveColor: 'lime',

  containerStyle: {
    flexBasis: 64,
    flexGrow: 0,
    marginTop: 0,
    marginBottom: 32,
    marginLeft: 8,
  },

  resendButton: {
    borderColor: '#FFFFFF',
  },

  resendButtonText: {
    color: '#FFFFFF',
  },
})
export default class ForgotPasswordForm extends Component {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
  };

  async onSubmit(code) {
    const isValid = (code === '12345'); // @TODO

    if (isValid) {
      this.props.onSuccess();
    } else {
      Toast.show({
        text: 'Verification code is invalid.',
        duration: 5000,
        buttonText: 'Ok',
        type: 'danger',
      });
    }
  }

  render() {
    const { styleSheet, onResend } = this.props;
    const { code: { color }, containerStyle } = styleSheet;

    return (
      <Form>
        <Code
          onFulfill={::this.onSubmit}
          activeColor={color}
          inactiveColor={color}
          containerStyle={containerStyle}
        />

        <ResendButton onPress={onResend} block bordered>
          <ResendButtonText>Resend the verification code</ResendButtonText>
        </ResendButton>
      </Form>
    );
  }
}
