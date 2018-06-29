import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import TextInputItem from '../../components/Form/TextInputItem';

class ForgotPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = { invalidCode: false };

  async onSubmit() {
    this.props.onSubmit();
  }

  render() {
    const { isValid, handleSubmit } = this.props;
    const { invalidCode } = this.state;
    const disabled = !(isValid && !invalidCode);

    return (
      <Form>
        <TextInputItem
          name="code"
          placeholder="code"
          secondaryErrorText={invalidCode && 'Invalid code'}
          {...this.props}
        />

        <Button onPress={handleSubmit} disabled={disabled} block bordered>
          <Text>Resend the verification code</Text>
        </Button>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  code: yup.string().required('Code is required'),
});

export default withFormik({
  handleSubmit: (values, { props, ...formikBag }) => props.onSubmit(values, formikBag),
  validationSchema,
})(ForgotPasswordForm);
