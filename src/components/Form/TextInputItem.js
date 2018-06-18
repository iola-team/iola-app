import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import Icon from 'react-native-vector-icons/Ionicons';

const FormItem = connectToStyleSheet('formItem', Item, ({ customStyle, isValid }) => ({
  ...customStyle,
  ...(isValid ? {} : {
    borderColor: 'rgba(255, 135, 135, 0.56)',
    backgroundColor: '#FFE0E0',
  }),
})).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input, ({ isValid }) => !isValid && ({
  color: '#FF8787',
})).withProps(({ isValid }) => ({
  placeholderFontSize: 16,
  placeholderTextColor: isValid ? '#FFFFFF' : '#FF8787',
}));
const CheckMark = connectToStyleSheet('checkMark', Icon).withProps({ name: 'ios-checkmark' });
const InfoText = connectToStyleSheet('infoText', Text);
const ErrorText = connectToStyleSheet('errorText', Text);

@styleSheet('Sparkle.FormTextInput', {
  formItem: {
    marginBottom: 8,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  formInput: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  checkMark: {
    paddingRight: 8,
    fontSize: 30,
    color: '#FFFFFF',
  },

  infoText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },

  errorText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#FF8787',
  },
})
export default class TextInputItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    values: PropTypes.object,
    touched: PropTypes.object,
    error: PropTypes.bool,
    errors: PropTypes.object,
    secondaryErrorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    customStyle: PropTypes.object,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    status: PropTypes.any,
    setStatus: PropTypes.func.isRequired,
    onChangeText: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    infoText: PropTypes.string,
  };

  static defaultProps = {
    error: false,
    customStyle: {},
    secureTextEntry: false,
    status: {},
    infoText: '',
  };

  render() {
    const {
      name,
      placeholder,
      values,
      touched,
      error,
      errors,
      secondaryErrorText,
      customStyle,
      setFieldTouched,
      setFieldValue,
      status,
      setStatus,
      onChangeText,
      secureTextEntry,
      infoText,
    } = this.props;
    const errorText = touched[name] && errors[name] ? errors[name] : secondaryErrorText;
    const isValid = !error && !errorText;
    const FieldError = errorText ? <ErrorText>{errorText}</ErrorText> : null;
    const FieldInfo = touched[name] ? <CheckMark /> : <InfoText>{infoText}</InfoText>;
    const onChange = (text) => {
      setStatus({ ...status, changed: true });

      onChangeText ? onChangeText(text) : setFieldValue(name, text);
    };

    return (
      <FormItem customStyle={customStyle} isValid={isValid}>
        <FormInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={values[name]}
          onChangeText={onChange}
          onBlur={() => setFieldTouched(name)}
          isValid={isValid}
        />
        {isValid ? FieldInfo : FieldError}
      </FormItem>
    );
  }
}
