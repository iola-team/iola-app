/* global __DEV__ */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Button, Form, Text, View } from 'native-base';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { withStyleSheet as styleSheet } from '~theme';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { DEV_LOGIN, DEV_PASSWORD } from 'react-native-dotenv';

import { FormTextInput, Spinner } from '~components';

const readTokenQuery = gql`
  {
    auth @client {
      token
    }
  }
`;

@styleSheet('Sparkle.SignInForm', {
  login: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  password: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  infoBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },

  commonError: {
    paddingLeft: 3,
    fontSize: 12,
    color: '#FF8787',
  },

  forgotPassword: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  submit: {
    position: 'relative',
    marginTop: 48,
  },

  spinner: {
    position: 'absolute',
    right: 15,
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

  onSubmit = async () => {
    const { validateForm, setFieldTouched, setErrors, isSubmitting, submitForm } = this.props;
    const errors = await validateForm();

    setFieldTouched('login', true);
    setFieldTouched('password', true);
    setErrors(errors || {});

    if (isSubmitting || !!Object.keys(errors).length) return; // @TODO: if initial values are not setted "!!Object.keys(errors).length" can be replaced with "!isValid"

    submitForm();
  };

  render() {
    const { values: { login }, onForgotPassword, isSubmitting, styleSheet: styles } = this.props;

    return (
      <Query query={readTokenQuery}>
        {({ data: { auth: { token } } }) => {
          const error = this.isAuthIsValid(token);

          return (
            <Form>
              <FormTextInput
                name="login"
                placeholder="Email or login"
                customStyle={styles.login}
                error={error}
                autoCapitalize="none"
                keyboardType="email-address"
                {...this.props}
              />

              <FormTextInput
                name="password"
                placeholder="Password"
                infoText="At least 4 characters"
                customStyle={styles.password}
                error={error}
                secureTextEntry
                {...this.props}
              />

              <View style={styles.infoBlock}>
                <TouchableOpacity onPress={() => onForgotPassword(login)}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                {error && <Text style={styles.commonError}>Wrong login or password</Text>}
              </View>

              <Button onPress={this.onSubmit} style={styles.submit} block>
                <Text>Sign in</Text>
                {isSubmitting && <Spinner style={styles.spinner} />}
              </Button>
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
  validationSchema,
  enableReinitialize: true,
  validateOnBlur: false,
  mapPropsToValues: ({ defaultEmail }) => defaultEmail
    ? ({ login: defaultEmail, password: '' })
    : __DEV__ ? ({ login: DEV_LOGIN, password: DEV_PASSWORD }) : ({ login: '', password: '' }),
  handleSubmit: (values, { props, ...formikBag }) => props.onSubmit(values, formikBag),
})(SignInForm);
