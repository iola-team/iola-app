import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { isEmpty, debounce, get } from 'lodash';

const validateEmailQuery = gql`
  query validateEmailQuery($email: String = "") {
    users(email: $email) {
      totalCount
    }
  }
`;

const FormItem = connectToStyleSheet('formItem', Item).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const ErrorText = connectToStyleSheet('errorText', Text);

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
export default class EmailInput extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    valueError: PropTypes.string,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldError: PropTypes.func.isRequired,
  };

  async onValidate(text, client) {
    if (isEmpty(text)) return;

    const { valueError, setFieldError } = this.props;
    const { data } = await client.query({
      query: validateEmailQuery,
      variables: { email: text }
    });
// alert(get(data, 'users.totalCount', 0));
    if (!valueError && get(data, 'users.totalCount', 0)) {
      setFieldError('email', 'Email is taken');
    }
  }

  changeValue = debounce(this.onValidate, 200);

  onChangeText(text, client) {
    this.props.setFieldValue('email', text);
    this.changeValue(text, client);
  }

  render() {
    const { value, valueError, setFieldTouched } = this.props;

    return (
      <ApolloConsumer>
        {client => (
          <FormItem>
            <FormInput
              placeholder="Email"
              onChangeText={text => ::this.onChangeText(text, client)}
              onBlur={() => setFieldTouched('email')}
              value={value}
            />
            {valueError ? <ErrorText>{valueError}</ErrorText> : null}
          </FormItem>
        )}
      </ApolloConsumer>
    );
  }
}
