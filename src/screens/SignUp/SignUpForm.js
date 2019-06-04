import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Text } from 'native-base';
import { graphql, ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce, get } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import { FormTextInput, Spinner } from '~components';

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
@styleSheet('Sparkle.SignUpForm', {
  submit: {
    position: 'relative',
    marginTop: 40,
  },

  spinner: {
    position: 'absolute',
    right: 15,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = { emailIsDuplicated: false };
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
      alert('Something went wrong'); // @TODO
    }

    if (success) onSubmit();
  }

  render() {
    const { styleSheet: styles, isSubmitting } = this.props;
    const { emailIsDuplicated } = this.state;

    return (
      <Mutation mutation={signUpUserMutation}>
        {signUpUser => (
          <Form>
            <FormTextInput
              name="name"
              placeholder="Full Name"
              autoCapitalize="words"
              {...this.props}

              textContentType="name"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.emailInput._root.focus()}
            />

            <ApolloConsumer>
              {client => (
                <FormTextInput
                  ref={ref => this.emailInput = ref}
                  name="email"
                  placeholder="Email"
                  onChangeText={text => this.onChangeEmail(text, client)}
                  secondaryErrorText={emailIsDuplicated && 'Email is taken'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  useCheckmarkIconOnValidValue
                  {...this.props}

                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.passwordInput._root.focus()}
                />
              )}
            </ApolloConsumer>

            <FormTextInput
              ref={ref => this.passwordInput = ref}
              name="password"
              placeholder="Password"
              infoText="At least 4 characters"
              secureTextEntry
              {...this.props}

              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => !emailIsDuplicated && this.onSubmit(signUpUser)}
            />

            <Button
              style={styles.submit}
              onPress={() => this.onSubmit(signUpUser)}
              disabled={emailIsDuplicated}
              block
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
