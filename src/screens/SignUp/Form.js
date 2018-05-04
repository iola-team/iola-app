import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const FormItem = connectToStyleSheet('formItem', Item).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input).withProps({ placeholderTextColor: '#FFFFFF' });
const ButtonSubmit = connectToStyleSheet('buttonSubmit', Button).withProps({ block: true });

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

  buttonSubmit: {
    marginTop: 40,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
  };

  render() {
    const {
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
            placeholder="Full Name"
            onChangeText={text => setFieldValue('name', text)}
            onBlur={() => setFieldTouched('name')}
            value={values.name}
          />
        </FormItem>
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
            value={values.password}
            secureTextEntry
          />
        </FormItem>
        <ButtonSubmit block onPress={handleSubmit}>
          <Text>Sign up</Text>
        </ButtonSubmit>
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
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(SignUpForm);
