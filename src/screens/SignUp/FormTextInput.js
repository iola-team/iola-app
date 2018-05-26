import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import Icon from 'react-native-vector-icons/Ionicons';

const FormItem = connectToStyleSheet('formItem', Item, ({ isValid }) => !isValid && ({
  borderColor: 'rgba(255, 135, 135, 0.56)',
  backgroundColor: '#FFE0E0'
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
    paddingHorizontal: 10,
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
class FormTextInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    values: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    onChangeText: PropTypes.func,
    secondaryErrorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    secureTextEntry: PropTypes.bool,
    infoText: PropTypes.string,
  };

  static defaultProps = {
    secureTextEntry: false,
    infoText: '',
  };

  render() {
    const {
      name,
      placeholder,
      values,
      touched,
      errors,
      setFieldTouched,
      setFieldValue,
      onChangeText,
      secondaryErrorText,
      secureTextEntry,
      infoText,
    } = this.props;
    const onChangeTextDefault = text => setFieldValue(name, text);
    const errorText = touched[name] && errors[name] ? errors[name] : secondaryErrorText;
    const isValid = !errorText;
    const FieldError = isValid ? null : <ErrorText>{errorText}</ErrorText>;
    const FieldInfo = touched[name] ? <CheckMark /> : <InfoText>{infoText}</InfoText>;

    return (
      <FormItem isValid={isValid}>
        <FormInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={values[name]}
          onChangeText={onChangeText ? onChangeText : onChangeTextDefault}
          onBlur={() => setFieldTouched(name)}
          isValid={isValid}
        />
        {isValid ? FieldInfo : FieldError}
      </FormItem>
    );
  }
}

export default FormTextInput;
