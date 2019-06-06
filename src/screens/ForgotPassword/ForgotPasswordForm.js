import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Text } from 'native-base';

import { FormTextInput, Spinner } from '~components';

class ForgotPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultEmail: PropTypes.string,
  };

  static defaultProps = {
    defaultEmail: '',
  };

  state = { emailDoesNotExist: false };

  render() {
    const { isValid, handleSubmit, defaultEmail, isSubmitting } = this.props;
    const { emailDoesNotExist } = this.state;
    const disabled = !(isValid && !emailDoesNotExist || defaultEmail);

    return (
      <Form>
        <FormTextInput
          name="email"
          placeholder="Email"
          secondaryErrorText={emailDoesNotExist && 'Email does not exist'}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="send"
          enablesReturnKeyAutomatically
          onSubmitEditing={() => !disabled && handleSubmit()}

          {...this.props}
        />

        <Button onPress={handleSubmit} disabled={disabled} block>
          <Text>Get new password</Text>
          {isSubmitting && <Spinner />}
        </Button>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
});

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ defaultEmail }) => ({ email: defaultEmail }),
  handleSubmit: (values, { props, ...formikBag }) => props.onSubmit(values, formikBag),
  validationSchema,
})(ForgotPasswordForm);
