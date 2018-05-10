import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { graphql, Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import { LAUNCH } from '../roteNames';

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
const SubmitButton = connectToStyleSheet('submitButton', Button).withProps({ block: true });

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

  submitButton: {
    marginTop: 40,
  },
})
class SignUpForm extends Component {
  // static getDerivedStateFromProps(nextProps, prevState) {
  // }

  async onSubmit(signUpUser) {
    const { values: { name, email, password }, storeToken } = this.props;
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
      if (_.find(error.graphQLErrors, { message: 'Duplicate email' })) {
        alert('This email is already taken');
      }
    }

    if (success) this.props.navigation.navigate(LAUNCH);
  }

  render() {
    const {
      values,
      setFieldValue,
      setFieldTouched,
      isValid,
    } = this.props;

    return (
      <Form>
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
          variables={{ email: values.email }}
        >
          {({ loading, error, data, startPolling, stopPolling }) => {
            if (loading) return <Text>LOADING</Text>;
            if (error) alert(`Error: ${JSON.stringify(error)}`);

            return <Text>Count: {data.users.totalCount}, {values.email}</Text>;
          }}
        </Query>
        <FormItem>
          <FormInput
            placeholder="Email"
            onChangeText={text => setFieldValue('email', text)}
            onBlur={() => setFieldTouched('email')}
            value={values.email}
          />
        </FormItem>
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
            <SubmitButton block onPress={() => ::this.onSubmit(signUpUser)}>
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
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default withFormik({
  mapPropsToValues: props => ({ name: 'Roman Banan', email: 'roman@banan.com', password: 'rb' }),
  validationSchema,
})(SignUpForm);
