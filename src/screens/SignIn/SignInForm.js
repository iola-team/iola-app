import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import TextInputItem from '../../components/Form/TextInputItem';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const ForgotPasswordButton = connectToStyleSheet('forgotPasswordButton', Button);
const ForgotPasswordText = connectToStyleSheet('forgotPasswordText', Text);
const SubmitButton = connectToStyleSheet('submitButton', Button);

@styleSheet('Sparkle.SignInForm', {
  forgotPasswordButton: {
    marginRight: -8,
    alignSelf: 'center',
  },

  forgotPasswordText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },

  submitButton: {
    marginTop: 48,
  },
})
class SignInForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
    onForgotPasswordPress: propTypes.func.isRequired,
  };

  isAuthIsValid(token) {
    const { isSubmitting, submitCount } = this.props;

    return !isSubmitting && !!submitCount && !token;
  }

  render() {
    const { onForgotPasswordPress, handleSubmit, isValid, status } = this.props;

    return (
      <Query query={gql`
        {
          auth @client {
            token
          }
        }
      `}>
        {({ data: { auth: { token } } }) => (
          <Form>
            <Text>{JSON.stringify(status)}</Text>
            <TextInputItem
              name="login"
              placeholder="Email or login"
              customStyle={{
                marginBottom: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomWidth: 0,
              }}
              error={this.isAuthIsValid(token)}
              {...this.props}
            />

            <TextInputItem
              name="password"
              placeholder="Password"
              infoText="At least 4 characters"
              customStyle={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              error={this.isAuthIsValid(token)}
              secureTextEntry
              {...this.props}
            />
            <ForgotPasswordButton transparent small onPress={() => onForgotPasswordPress()}>
              <ForgotPasswordText>Forgot password?</ForgotPasswordText>
            </ForgotPasswordButton>

            <SubmitButton block onPress={handleSubmit} disabled={!isValid}>
              <Text>Submit</Text>
            </SubmitButton>
          </Form>
        )}
      </Query>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Email or login is required').min(3, 'Email or login is too short'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({
  mapPropsToValues: props => ({ login: 'demo5@oxpro.or', password: 'demo1986' }),
  handleSubmit: (values, { props, setSubmitting, status, setStatus }) => props.onSubmit(values, {
    setSubmitting,
    status,
    setStatus,
  }),
  validationSchema,
})(SignInForm);
