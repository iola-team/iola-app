import React, { Component } from 'react';
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
    useCheckmarkIconOnValidValue: PropTypes.bool,
  };

  static defaultProps = {
    error: false,
    customStyle: {},
    secureTextEntry: false,
    status: {},
    infoText: '',
    useCheckmarkIconOnValidValue: false,
  };

  state = {
    isFocused: false,
    isPasswordIsShown: false,
  };

  inputRef = null;

  focus = () => this.inputRef._root.focus();

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
      values,
      touched,
      error,
      errors,
      secondaryErrorText,
      customStyle,
      secureTextEntry,
      infoText,
      useCheckmarkIconOnValidValue,
      ...props
    } = this.props;
    const { isFocused, isPasswordIsShown } = this.state;
    const value = values[name] || '';
    const isTouched = touched[name];
    const errorText = isTouched && errors[name] ? errors[name] : secondaryErrorText;
    const isValid = !error && !errorText;
    const FieldError = errorText ? <Text style={styles.errorText}>{errorText}</Text> : null;
    let FieldInfo = null;

    if (isTouched && value.length && useCheckmarkIconOnValidValue) {
      FieldInfo = <Icon style={[styles.checkMark, isFocused && { color: '#BCBFCA' }]} name="check" />;
    }

    if (!isTouched && !value.length) {
      FieldInfo = (
        <Text style={[styles.infoText, isFocused && { color: '#BCBFCA' }]}>
          {infoText}
        </Text>
      );
    }

    return (
      <Item
        style={[
          styles.formItem,
          customStyle,
          isFocused && { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
          !isValid && { borderColor: '#FFE0E0', backgroundColor: '#FFE0E0' },
        ]}
        pointerEvents="none"
        regular
      >
        <Input
          ref={ref => this.inputRef = ref}
          {...props}

          style={[
            styles.formInput,
            secureTextEntry && !isPasswordIsShown && { paddingRight: isTouched ? 80 : 50 },
            isFocused && { color: '#BCBFCA' }, // @TODO: TextInput dynamic color issue: https://github.com/facebook/react-native/issues/20131
            !isValid && { color: '#FF8787' }, // @TODO: TextInput dynamic color issue: https://github.com/facebook/react-native/issues/20131
          ]}
          placeholderFontSize={16}
          placeholderTextColor={isValid ? (isFocused ? '#BCBFCA' : '#FFFFFF') : '#FF8787'}
          secureTextEntry={secureTextEntry && !isPasswordIsShown}
          value={value}
          onChangeText={::this.onChangeText}
          onFocus={::this.onFocus}
          onBlur={::this.onBlur}
          isValid={isValid}
        />
        <View pointerEvents="none" style={[styles.infoContent, !secureTextEntry && { position: 'relative', right: 0 }]}>
          {isValid ? FieldInfo : FieldError}
        </View>
        {secureTextEntry && (
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
        )}
      </Item>
    );
  }
}
