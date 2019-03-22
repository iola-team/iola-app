import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Text, Toast } from 'native-base';
// import CodeInput from 'react-native-confirmation-code-input'; // @TODO: Iteration 2

import { withStyleSheet as styleSheet } from '~theme';

// @TODO: Iteration 2
/*
const Code = connectToStyleSheet('code', CodeInput).withProps(({ compareWithCode, onFulfill }) => ({
  compareWithCode,
  onFulfill,
  autoFocus: true,
  ignoreCase: true,
  secureTextEntry: false,
  inputPosition: 'center',
}));
*/

@styleSheet('Sparkle.EmailVerificationForm', {
  code: {
    width: 40,
    height: 64,
    marginRight: 8,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#585A61',
    backgroundColor: '#FFFFFF',
  },

  container: {
    flexBasis: 64,
    flexGrow: 0,
    marginTop: 0,
    marginBottom: 32,
    marginLeft: 8,
  },

  button: {
    borderColor: '#FFFFFF',
  },

  buttonText: {
    color: '#FFFFFF',
  },
})
export default class ForgotPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  // @TODO: Iteration 2 (Email Verification with short code)
  /*
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
  */

  render() {
    const { styleSheet: styles, onSubmit, isSubmitting } = this.props;

    return (
      <Form>
        {/* // @TODO: Iteration 2 (Email Verification with short code)
        <Code
          onFulfill={::this.onSubmit}
          activeColor={styles.code.color}
          inactiveColor={styles.code.color}
          containerStyle={styles.container}
        />
        */}

        <Button style={styles.button} onPress={onSubmit} disabled={isSubmitting} block bordered>
          <Text style={styles.buttonText}>Resend the Verification Code</Text>
        </Button>
      </Form>
    );
  }
}
