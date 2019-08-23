import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Text } from 'native-base';
// import CodeInput from 'react-native-confirmation-code-input'; // TODO: Iteration 2

import { withStyleSheet as styleSheet, withStyle } from '~theme';
import { LogoutButton, TouchableOpacity } from '~components';

// TODO: Iteration 2
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

@styleSheet('iola.EmailVerificationForm', {
  // TODO: Iteration 2 (Email Verification with short code)
  /*
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
  */
})
@withStyle('iola.ForgotPasswordForm', {
  'NativeBase.Form': {
    'iola.TouchableOpacity': {
      marginTop: 8,
    },
  },
})
export default class ForgotPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  // TODO: Iteration 2 (Email Verification with short code)
  /*
  async onSubmit(code) {
    const isValid = (code === '12345'); // TODO

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
        {/* // TODO: Iteration 2 (Email Verification with short code)
        <Code
          onFulfill={::this.onSubmit}
          activeColor={styles.code.color}
          inactiveColor={styles.code.color}
          containerStyle={styles.container}
        />
        */}

        <TouchableOpacity onPress={onSubmit} disabled={isSubmitting} button bordered>
          <Text style={styles.buttonText}>Resend the Verification Code</Text>
        </TouchableOpacity>

        <LogoutButton button bordered />
      </Form>
    );
  }
}
