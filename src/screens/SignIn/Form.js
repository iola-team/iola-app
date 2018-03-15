import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Label, Text, View, Icon } from 'native-base';

import { withStyleSheet as styleSheet } from '../../theme';

@styleSheet('Sparkle.SignInForm', {
  root: {

  },

  inputContainer: {
    paddingLeft: 10,
    paddingRight: 2,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  input: {
    color: '#FFFFFF',
  },

  submit: {
    marginTop: 40,
    width: '55%',
    alignSelf: 'center',
  },

  forgotPassword: {
    marginRight: -8,
    alignSelf: 'center',
  },

  forgotPasswordText: {
    color: '#FFFFFF',
  }
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
        <Item regular style={styleSheet.inputContainer}>
          <Input style={styleSheet.input}
            placeholder="Login"
            onChangeText={text => setFieldValue('login', text)}
            onBlur={() => setFieldTouched('login')}
            value={values.login}
          />
        </Item>

        <Item regular style={styleSheet.inputContainer}>
          <Input style={styleSheet.input}
            secureTextEntry
            placeholder="Password"
            onChangeText={text => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            value={values.password}
          />

          <Button transparent small style={styleSheet.forgotPassword} onPress={() => onForgotPasswordPress()}>
            <Text style={styleSheet.forgotPasswordText}>Forgot password?</Text>
          </Button>
        </Item>

        <Button block style={styleSheet.submit} onPress={handleSubmit}>
          <Text>Submit</Text>
        </Button>

      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required("Login is required"),
  password: yup.string().required("Password is required"),
});

export default withFormik({
  mapPropsToValues: props => ({ login: 'demo', password: 'demo1986' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(LoginForm);
