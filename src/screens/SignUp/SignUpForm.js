import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Text, View } from 'native-base';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { graphql, ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce, get } from 'lodash';
import { LICENSE_AGREEMENT_URL } from 'react-native-dotenv';

import { withStyleSheet as styleSheet } from '~theme';
import { CheckBox, FormTextInput, Spinner, TouchableOpacity } from '~components';

const validateEmailQuery = gql`
  query validateEmailQuery($email: String = "") {
    users(filter: { email: $email }) {
      totalCount
    }
  }
`;

const signUpUserMutation = gql`
  mutation signUpUserMutation($input: SignUpUserInput!) {
    result: signUpUser(input: $input) {
      accessToken
      user {
        id
        name
        email
        isOnline
      }
    }
  }
`;

@graphql(gql`
  mutation($token: String!) {
    storeAuthToken(token: $token) @client
  }
`, {
  props: ({ mutate }) => ({
    storeToken: token => mutate({ variables: { token } }),
  }),
})
@styleSheet('iola.SignUpForm', {
  termsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },

  termsText: {
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  termsButton: {
    paddingHorizontal: 4,
  },

  termsButtonText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },

  submit: {
    position: 'relative',
    marginTop: 20,
  },

  spinner: {
    position: 'absolute',
    right: 15,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onLicenseAgreementPress: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    emailIsDuplicated: false,
    isAgreementChecked: false,
  };

  emailInput = null;
  passwordInput = null;
  validateEmail = debounce(this.onValidateEmail, 200);

  async onValidateEmail(text, client) {
    if (this.props.errors.email) return;

    const { data } = await client.query({
      query: validateEmailQuery,
      variables: { email: text }
    });
    const emailIsDuplicated = !!get(data, 'users.totalCount', 0);

    if (emailIsDuplicated !== this.state.emailIsDuplicated) this.setState({ emailIsDuplicated });
  }

  onChangeEmail(text, client) {
    this.validateEmail(text, client);
  }

  async onSubmit(signUpUser) {
    const {
      isValid,
      onSubmit,
      setErrors,
      setFieldTouched,
      setSubmitting,
      storeToken,
      validateForm,
      values: { name, email, password },
    } = this.props;
    const errors = await validateForm();
    let success = false;

    setFieldTouched('name', true);
    setFieldTouched('email', true);
    setFieldTouched('password', true);
    setErrors(errors || {});

    if (!isValid) return;

    setSubmitting(true);

    try {
      const { data: { result } } = await signUpUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      await storeToken(result.accessToken);
      success = !!result.accessToken;
    } catch (error) {
      alert('Something went wrong'); // TODO
    }

    if (success) onSubmit();
  }

  render() {
    const { styleSheet: styles, onLicenseAgreementPress, isSubmitting } = this.props;
    const { emailIsDuplicated, isAgreementChecked } = this.state;

    return (
      <Mutation mutation={signUpUserMutation}>
        {signUpUser => (
          <Form>
            <FormTextInput
              {...this.props}
              name="name"
              placeholder="Full Name"
              autoCapitalize="words"
              textContentType="name"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.emailInput._root.focus()}
            />

            <ApolloConsumer>
              {client => (
                <FormTextInput
                  {...this.props}
                  useCheckmarkIconOnValidValue
                  ref={ref => this.emailInput = ref}
                  name="email"
                  placeholder="Email"
                  onChangeText={text => this.onChangeEmail(text, client)}
                  secondaryErrorText={emailIsDuplicated && 'Email is taken'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.passwordInput._root.focus()}
                />
              )}
            </ApolloConsumer>

            <FormTextInput
              {...this.props}
              secureTextEntry
              ref={ref => this.passwordInput = ref}
              name="password"
              placeholder="Password"
              infoText="At least 4 characters"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => !emailIsDuplicated && this.onSubmit(signUpUser)}
            />

            <View style={styles.termsContainer}>
              <CheckBox
                onPress={() => this.setState({ isAgreementChecked: !isAgreementChecked })}
                checked={isAgreementChecked}
              />
              <Text style={styles.termsText}>I agree to the</Text>
              <TouchableOpacity style={styles.termsButton} onPress={onLicenseAgreementPress}>
                <Text style={styles.termsButtonText}>License Agreement</Text>
              </TouchableOpacity>
            </View>

            <Button
              block
              style={styles.submit}
              onPress={() => this.onSubmit(signUpUser)}
              disabled={emailIsDuplicated || !isAgreementChecked}
            >
              <Text>Sign up</Text>
              {isSubmitting && <Spinner style={styles.spinner} />}
            </Button>
          </Form>
        )}
      </Mutation>
    );
  }
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name is too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({ validationSchema, validateOnBlur: false })(SignUpForm);
