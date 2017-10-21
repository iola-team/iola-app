import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Field } from 'redux-form';
import { Form, View, Input, Item } from 'native-base';

const Wrapper = styled(View)`
  margin-bottom: 10px;
`;

const TextInput = ({ input: { onChange, ...props }, meta: { error }, last, ...ownProps }) => (
  <Item last={last}>
    <Input onChangeText={onChange}
           {...props}
           {...ownProps}
    />
  </Item>
);

export default class SignInForm extends Component {
  render() {
    const { style, handleSubmit } = this.props;

    return (
      <Wrapper style={style}>
        <Form onSubmit={handleSubmit}>
          <Field name="login"
                 placeholder="Email"
                 component={TextInput}
          />
          <Field name="password"
                 placeholder="Password"
                 secureTextEntry
                 component={TextInput}
          />
        </Form>
      </Wrapper>
    );
  }
}