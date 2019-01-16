import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Text } from 'native-base';
import { withStyleSheet as styleSheet } from 'theme';

import Icon from '../Icon';

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
    fontSize: 11,
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
export default class TextInput extends Component {
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

  state = {
    isPasswordIsShown: false,
  };

  onShowPassword() {
    this.setState({ isPasswordIsShown: !this.state.isPasswordIsShown });
  }

  render() {
    const {
      styleSheet: styles,
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
    const FieldError = errorText ? <Text style={styles.errorText}>{errorText}</Text> : null;
    const FieldInfo = touched[name] ? <Icon name="check" style={styles.checkMark} /> : (
      <Text style={styles.infoText}>{infoText}</Text>
    );
    const onChange = (text) => {
      setStatus({ ...status, changed: true });

      if (onChangeText) {
        onChangeText(text);
      } else {
        setFieldValue(name, text);
      }
    };

    return (
      <Item
        style={[
          styles.formItem,
          customStyle,
          isValid ? {} : { borderColor: 'rgba(255, 135, 135, 0.56)', backgroundColor: '#FFE0E0' },
        ]}
        pointerEvents="none"
        regular
      >
        <Input
          style={[
            styles.formInput,
            isValid ? {} : { color: '#FF8787' },
          ]}
          placeholder={placeholder}
          placeholderFontSize={16}
          placeholderTextColor={isValid ? '#FFFFFF' : '#FF8787'}
          secureTextEntry={secureTextEntry}
          value={values[name]}
          onChangeText={onChange}
          onBlur={() => setFieldTouched(name)}
          isValid={isValid}
        />
        {isValid ? FieldInfo : FieldError}
        {/* @TODO: if we place it here the TouchableOpacity will not response to clicks on absolute right negative position */}
        {/*{secureTextEntry && (*/}
          {/*<TouchableOpacity onPress={::this.onShowPassword} style={styles.showPassword}>*/}
            {/*<Icon*/}
              {/*name={isPasswordIsShown ? 'eye' : 'eye-crossed'}*/}
              {/*style={styles.showPasswordIcon}*/}
            {/*/>*/}
          {/*</TouchableOpacity>*/}
        {/*)}*/}
      </Item>
    );
  }
}
