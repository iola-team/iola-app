import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import TextInputItem from '../../components/Form/TextInputItem';

const SubmitButton = connectToStyleSheet('submitButton', Button).withProps(({ disabled }) => ({
  disabled,
  block: true,
}));

@styleSheet('Sparkle.ForgotPasswordForm', {
  submitButton: {
    marginTop: 40,
  },
})
class ForgotPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = { emailDoesNotExist: false };

  async onSubmit() {
    this.props.onSubmit();
  }

  render() {
    const { isValid } = this.props;
    const { emailDoesNotExist } = this.state;
    const disabled = !(isValid && !emailDoesNotExist);

    return (
      <Form>
        <TextInputItem
          name="email"
          placeholder="Email"
          secondaryErrorText={emailDoesNotExist && 'Email does not exist'}
          {...this.props}
        />

        <SubmitButton onPress={() => this.onSubmit()} disabled={disabled} block>
          <Text>Get new password</Text>
        </SubmitButton>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
});

export default withFormik({ validationSchema })(ForgotPasswordForm);
