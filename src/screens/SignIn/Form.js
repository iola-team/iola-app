import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import styled from 'styled-components/native';
import { Button, Form, Input, Item, Label, Text, View, Icon } from 'native-base';

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};

const FormItem = styled(Item).attrs({ regular: true })`
  margin-bottom: 15px;
  padding: 0 10px;
  border-radius: 10px;
  border-color: rgba(255, 255, 255, .6);
`;

const FormInput = styled(Input).attrs({ placeholderTextColor: 'white' })`
  font-size: 16px;
  color: white;
`;

const SignInButton = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
  width: 55%;
  height: 50px;
  margin-top: 10%;
  align-self: center;
  border-radius: 10px;
  background-color: ${props => props.theme.accent};
`;

const ForgotPasswordButton = styled(Button).attrs({ transparent: true })`
  height: 50px;
  margin-right: -8px;
`;

const ForgotPasswordText = styled(Text)`
  font-size: 12px;
  color: white;
`;

const Bold = styled(Text)`
  font-weight: 500;
  font-size: 16px;
`;

class LoginForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
    onForgotPasswordPress: propTypes.func.isRequired,
  };

  render() {
    const {
      onForgotPasswordPress,
      values,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isValid,
    } = this.props;

    return (
      <Form>
        <FormItem>
          <FormInput
            placeholder="Login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            values={values.login}
          />
        </FormItem>

        <FormItem>
          <FormInput secureTextEntry
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            values={values.password}
          />

          <ForgotPasswordButton onPress={() => onForgotPasswordPress()}>
            <ForgotPasswordText>Forgot password?</ForgotPasswordText>
          </ForgotPasswordButton>
        </FormItem>

        <SignInButton disabled={!isValid} onPress={handleSubmit}>
          <Bold>Submit</Bold>
        </SignInButton>

      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required("Login is required"),
  password: yup.string().required("Password is required"),
});

export default withFormik({
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(LoginForm);
