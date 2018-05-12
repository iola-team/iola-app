import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { graphql, Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { find, get } from 'lodash';

const validateEmailQuery = gql`
  query validateEmailQuery($email: String = "", $skip: Boolean!) {
    users(email: $email) @skip(if: $skip) {
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
const SubmitButton = connectToStyleSheet('submitButton', Button).withProps(({ isValid }) => ({
  block: true,
  disabled: !isValid,
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
      if (find(error.graphQLErrors, { message: 'Duplicate email' })) {
        alert('This email is already taken');
      }
    }

    if (success) onSubmit();
  }

  render() {
    const { values, errors, isValid, setFieldValue, setFieldError, setFieldTouched } = this.props;

    return (
      <Form>
        <Text>{JSON.stringify(errors)}</Text>
        <FormItem>
          <FormInput
            placeholder="Full Name"
            onChangeText={text => setFieldValue('name', text)}
            onBlur={() => setFieldTouched('name')}
            value={values.name}
          />
        </FormItem>
        <Query
          query={validateEmailQuery}
          variables={{ email: values.email, skip: true /* @TODO */}}
          skip={!!errors.email}
        >
          {({ data, error }) => {
            if (error) alert('Something went wrong');

            if (!errors.email && !!get(data, 'users.totalCount')) {
              alert(JSON.stringify(data));
              setFieldError('email', 'Email is taken');
            }

            return (
              <FormItem>
                <FormInput
                  placeholder="Email"
                  onChangeText={text => setFieldValue('email', text)}
                  onBlur={() => setFieldTouched('email')}
                  value={values.email}
                />
                {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
              </FormItem>
            );
          }}
        </Query>
        <FormItem>
          <FormInput
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            secureTextEntry
            value={values.password}
          />
        </FormItem>

        <Mutation mutation={signUpUserMutation}>
          {signUpUser => (
            <SubmitButton onPress={() => ::this.onSubmit(signUpUser)} isValid={isValid} block>
              <Text>Sign up</Text>
            </SubmitButton>
          )}
        </Mutation>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({
  mapPropsToValues: props => ({ name: 'Roman Banan', email: '', password: '1234' }),
  validationSchema,
})(SignUpForm);
