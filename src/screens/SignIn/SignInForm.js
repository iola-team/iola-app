import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const ItemEmailOrLogin = connectToStyleSheet('itemEmailOrLogin', Item).withProps({ regular: true });
const ItemPassword = connectToStyleSheet('itemPassword', Item).withProps({ regular: true });
const InputTransparent = connectToStyleSheet('inputTransparent', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const ErrorText = connectToStyleSheet('errorText', Text);
const itemStyle = {
  paddingHorizontal: 10,
  borderRadius: 8,
  borderColor: 'rgba(255, 255, 255, .6)',
};
const ForgotPasswordButton = connectToStyleSheet('forgotPasswordButton', Button);
const ForgotPasswordText = connectToStyleSheet('forgotPasswordText', Text);
const SubmitButton = connectToStyleSheet('submitButton', Button);

@styleSheet('Sparkle.SignInForm', {
  itemEmailOrLogin: {
    ...itemStyle,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  itemPassword: {
    ...itemStyle,
    paddingRight: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  inputTransparent: {
    fontSize: 16,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  errorText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FF8787',
  },

  forgotPasswordButton: {
    marginRight: -8,
    alignSelf: 'center',
  },

  forgotPasswordText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },

  submitButton: {
    marginTop: 48,
  },
})
class SignInForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
    onForgotPasswordPress: propTypes.func.isRequired,
  };

  renderFieldError(name) {
    const { touched, errors } = this.props;

    return touched[name] && errors[name] ? <ErrorText>{errors[name]}</ErrorText> : null;
  }

  render() {
    const { onForgotPasswordPress, values, setFieldValue, setFieldTouched, handleSubmit, isValid } = this.props;

    return (
      <Form>
        <ItemEmailOrLogin>
          <InputTransparent
            placeholder="Email or login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            value={values.login}
          />
          {this.renderFieldError('login')}
        </ItemEmailOrLogin>

        <ItemPassword>
          <InputTransparent
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
            secureTextEntry
          />
          <ForgotPasswordButton transparent small onPress={() => onForgotPasswordPress()}>
            <ForgotPasswordText>Forgot password?</ForgotPasswordText>
          </ForgotPasswordButton>
          {this.renderFieldError('password')}
        </ItemPassword>

        <SubmitButton block onPress={handleSubmit} disabled={!isValid}>
          <Text>Submit</Text>
        </SubmitButton>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Email or login is required').min(3, 'Email or login is too short'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({
  mapPropsToValues: props => ({ login: 'demo5@oxpro.org', password: 'demo1986' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(SignInForm);
