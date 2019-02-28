import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Input, Item, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import TouchableOpacity from '../TouchableOpacity';

import Icon from '../Icon';

@styleSheet('Sparkle.FormTextInput', {
  formItem: {
    positions: 'relative',
    marginBottom: 8,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  formInput: {
    fontSize: 16,
    paddingVertical: 0,
    color: '#FFFFFF',
  },

  infoContent: {
    position: 'absolute',
    top: 2,
    right: 48 + 17,
  },

  verticalLine: {
    position: 'absolute',
    right: 48,
    top: 0,
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, .6)',
  },

  showPassword: {
    position: 'absolute',
    right: 8,
    top: 15,
  },

  showPasswordIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },

  infoText: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 48,
    color: '#FFFFFF',
  },

  errorText: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 48,
    color: '#FF8787',
  },

  checkMark: {
    paddingRight: 3,
    fontSize: 11,
    lineHeight: 48,
    color: '#FFFFFF',
  },
})
export default class FormTextInput extends Component {
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
    isFocused: false,
    isPasswordIsShown: false,
  };

  onFocus() {
    this.setState({ isFocused: true });
  }

  onBlur() {
    const { name, setFieldTouched } = this.props;

    setFieldTouched(name);
    this.setState({ isFocused: false });
  }

  onShowPassword() {
    this.setState({ isPasswordIsShown: !this.state.isPasswordIsShown });
  }

  onChangeText(text) {
    const { name, setFieldValue, status, setStatus, onChangeText } = this.props;

    setStatus({ ...status, changed: true });
    setFieldValue(name, text);

    if (onChangeText) onChangeText(text);
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
      secureTextEntry,
      infoText,
    } = this.props;
    const { isFocused, isPasswordIsShown } = this.state;
    const value = values[name] || '';
    const isTouched = touched[name];
    const errorText = isTouched && errors[name] ? errors[name] : secondaryErrorText;
    const isValid = !error && !errorText;
    const FieldError = errorText ? <Text style={styles.errorText}>{errorText}</Text> : null;
    const FieldInfo = isTouched ? (
      <Icon style={[styles.checkMark, isFocused && { color: '#BCBFCA' }]} name="check" />
    ) : value.length ? null : (
      <Text style={[styles.infoText, isFocused && { color: '#BCBFCA' }]}>
        {infoText}
      </Text>
    );

    return (
      <Item
        style={[
          styles.formItem,
          customStyle,
          isFocused && { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
          !isValid && { borderColor: '#FF8787', backgroundColor: '#FFE0E0' },
        ]}
        pointerEvents="none"
        regular
      >
        <Input
          style={[
            styles.formInput,
            secureTextEntry && !isPasswordIsShown && { paddingRight: isTouched ? 80 : 50 },
            isFocused && { color: '#BCBFCA' },
            !isValid && { color: '#FF8787' },
          ]}
          placeholder={placeholder}
          placeholderFontSize={16}
          placeholderTextColor={isValid ? '#FFFFFF' : '#FF8787'}
          secureTextEntry={secureTextEntry && !isPasswordIsShown}
          value={value}
          onChangeText={::this.onChangeText}
          onFocus={::this.onFocus}
          onBlur={::this.onBlur}
          isValid={isValid}
        />
        <View style={[styles.infoContent, !secureTextEntry && { position: 'relative', right: 0 }]}>
          {isValid ? FieldInfo : FieldError}
        </View>
        {secureTextEntry && (
          <Fragment>
            <View
              style={[
                styles.verticalLine,
                isFocused && { backgroundColor: '#BCBFCA' },
                !isValid && { backgroundColor: '#FF8787' },
              ]}
            />
            <TouchableOpacity onPress={::this.onShowPassword} style={styles.showPassword}>
              <Icon
                style={[
                  styles.showPasswordIcon,
                  isFocused && { color: '#BCBFCA' },
                  !isValid && { color: '#FF8787' },
                ]}
                name={isPasswordIsShown ? 'eye-crossed' : 'eye'}
              />
            </TouchableOpacity>
          </Fragment>
        )}
      </Item>
    );
  }
}
