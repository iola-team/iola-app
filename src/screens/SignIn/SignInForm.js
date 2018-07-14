import React, { Component } from 'react';
import propTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Button, Form, Text, View } from 'native-base';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import TextInputItem from '../../components/Form/TextInputItem';

const InfoBlock = connectToStyleSheet('infoBlock', View);
const CommonErrorText = connectToStyleSheet('commonErrorText', Text);
const ForgotPasswordText = connectToStyleSheet('forgotPasswordText', Text);
const SubmitButton = connectToStyleSheet('submitButton', Button);

readTokenQuery = gql`
  {
    auth @client {
      token
    }
  }
`;

@styleSheet('Sparkle.SignInForm', {
  infoBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },

  commonErrorText: {
    fontSize: 12,
    color: '#FF8787',
  },

  forgotPasswordText: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  submitButton: {
    marginTop: 48,
  },
})
class SignInForm extends Component {
  static propTypes = {
    defaultEmail: propTypes.string,
    onSubmit: propTypes.func.isRequired,
    onForgotPassword: propTypes.func.isRequired,
  };

  static defaultProps = {
    defaultEmail: '',
  };

  isAuthIsValid(token) {
    const { isSubmitting, submitCount, status } = this.props;

    return !isSubmitting && !!submitCount && !token && !status.changed;
  }

  render() {
    const { values: { login }, onForgotPassword, handleSubmit, isValid } = this.props;
    const disabled = !(isValid || login);

    return (
      <Query query={readTokenQuery}>
        {({ data: { auth: { token } } }) => {
          const error = this.isAuthIsValid(token);

          return (
            <Form>
              <TextInputItem
                name="login"
                placeholder="Email or login"
                customStyle={{
                  marginBottom: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomWidth: 0,
                }}
                error={error}
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
                error={error}
                secureTextEntry
                {...this.props}
              />

              <InfoBlock>
                <TouchableOpacity onPress={() => onForgotPassword(login)}>
                  <ForgotPasswordText>Forgot password?</ForgotPasswordText>
                </TouchableOpacity>

                {error ? <CommonErrorText>Wrong login or password</CommonErrorText> : null}
              </InfoBlock>

              <SubmitButton block onPress={handleSubmit} disabled={disabled}>
                <Text>Submit</Text>
              </SubmitButton>
            </Form>
          );
        }}
      </Query>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Email or login is required').min(3, 'Email or login is too short'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ defaultEmail }) => {
    return defaultEmail
      ? ({ login: defaultEmail, password: '' })
      : ({ login: 'demo5@oxpro.org', password: 'demo1986' }); // @TODO: remove it
  },
  handleSubmit: (values, { props, ...formikBag }) => props.onSubmit(values, formikBag),
  validationSchema,
})(SignInForm);
