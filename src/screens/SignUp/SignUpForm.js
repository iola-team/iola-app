import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { graphql, ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce, find, get, isEmpty } from 'lodash';

const validateEmailQuery = gql`
  query validateEmailQuery($email: String = "") {
    users(email: $email) {
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
        activityTime
      }
    }
  }
`;

const FormItem = connectToStyleSheet('formItem', Item).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const ErrorText = connectToStyleSheet('errorText', Text);
const SubmitButton = connectToStyleSheet('submitButton', Button).withProps(({ disabled }) => ({
  disabled,
  block: true,
}));

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
  formItem: {
    marginBottom: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  formInput: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  errorText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FF8787',
  },

  submitButton: {
    marginTop: 40,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = { emailIsDuplicated: false };

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
    this.props.setFieldValue('email', text);
    this.validateEmail(text, client);
  }

  async onSubmit(signUpUser) {
    const { values: { name, email, password }, storeToken, onSubmit } = this.props;
    let success = false;

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

  renderFieldError(name, secondaryErrorText) {
    const { touched, errors } = this.props;
    const errorText = touched[name] && errors[name] ? errors[name] : secondaryErrorText;

    return errorText ? <ErrorText>{errorText}</ErrorText> : null;
  }

  render() {
    const { values, isValid, setFieldValue, setFieldTouched } = this.props;
    const { emailIsDuplicated } = this.state;

    return (
      <Form>
        <FormItem>
          <FormInput
            placeholder="Full Name"
            onChangeText={text => setFieldValue('name', text)}
            onBlur={() => setFieldTouched('name')}
            value={values.name}
          />
          {::this.renderFieldError('name')}
        </FormItem>

        <ApolloConsumer>
          {client => (
            <FormItem>
              <FormInput
                placeholder="Email"
                onChangeText={text => this.onChangeEmail(text, client)}
                onBlur={() => setFieldTouched('email')}
                value={values.email}
              />
              {::this.renderFieldError('email', emailIsDuplicated && 'Email is taken')}
            </FormItem>
          )}
        </ApolloConsumer>

        <FormItem>
          <FormInput
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
            secureTextEntry
          />
          {::this.renderFieldError('password')}
        </FormItem>

        <Mutation mutation={signUpUserMutation}>
          {signUpUser => (
            <SubmitButton onPress={() => ::this.onSubmit(signUpUser)} disabled={!(isValid && !emailIsDuplicated)} block>
              <Text>Sign up</Text>
            </SubmitButton>
          )}
        </Mutation>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name is too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({ validationSchema })(SignUpForm);
