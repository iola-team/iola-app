import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Label, Text, View, Icon } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const ItemLogin = connectToStyleSheet('itemLogin', Item).withProps({ regular: true });
const ItemPassword = connectToStyleSheet('itemPassword', Item).withProps({ regular: true });
const InputTransparent = connectToStyleSheet('inputTransparent', Input);
const itemStyle = {
  paddingLeft: 10,
  paddingRight: 2,
  borderRadius: 8,
  borderColor: 'rgba(255, 255, 255, .6)',
};
const ButtonForgotPassword = connectToStyleSheet('buttonForgotPassword', Button);
const ButtonSubmit = connectToStyleSheet('buttonSubmit', Button);
const ForgotPasswordText = connectToStyleSheet('forgotPasswordText', Text);

@styleSheet('Sparkle.SignInForm', {
  root: {

  },

  itemLogin: {
    ...itemStyle,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  itemPassword: {
    ...itemStyle,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  inputTransparent: {
    color: 'white',
  },

  buttonForgotPassword: {
    marginRight: -8,
    alignSelf: 'center',
  },

  forgotPasswordText: {
    fontSize: 12,
    color: 'white',
  },

  buttonSubmit: {
    marginTop: 48,
    width: '100%',
  },
})
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
      styleSheet,
      style,
    } = this.props;

    return (
      <Form style={[styleSheet.root, style]}>
        <ItemLogin>
          <InputTransparent
            placeholder="Login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            value={values.login}
          />
        </ItemLogin>

        <ItemPassword>
          <InputTransparent
            secureTextEntry
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
          />

          <ButtonForgotPassword transparent small onPress={() => onForgotPasswordPress()}>
            <ForgotPasswordText>Forgot password?</ForgotPasswordText>
          </ButtonForgotPassword>
        </ItemPassword>

        <ButtonSubmit block onPress={handleSubmit}>
          <Text>Submit</Text>
        </ButtonSubmit>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Login is required'),
  password: yup.string().required('Password is required'),
});

export default withFormik({
  mapPropsToValues: props => ({ login: 'demo', password: 'demo1986' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(LoginForm);
