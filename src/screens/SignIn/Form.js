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
  paddingHorizontal: 10,
  borderRadius: 8,
  borderColor: 'rgba(255, 255, 255, .6)',
};
const ButtonForgotPassword = connectToStyleSheet('buttonForgotPassword', Button);
const ButtonSubmit = connectToStyleSheet('buttonSubmit', Button);
const TextForgotPassword = connectToStyleSheet('textForgotPassword', Text);

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
    paddingRight: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  inputTransparent: {
    //fontFamily: "SF Pro Text";
    //fontSize: 16,
    //lineHeight: 17,
    color: 'white',
  },

  buttonForgotPassword: {
    marginRight: -8,
    alignSelf: 'center',
  },

  textForgotPassword: {
    fontSize: 12,
    color: 'white',
  },

  buttonSubmit: {
    marginTop: 48,
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
            <TextForgotPassword>Forgot password?</TextForgotPassword>
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
