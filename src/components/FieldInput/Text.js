import React, { Component } from 'react';
import { Input } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import FieldInput from './FieldInput';

@styleSheet('Sparkle.TextInput')
export default class TextInput extends Component {
  render() {
    const {
      value,
      onChange,
      onFinishEditing,
      secure,
      multiline,
      placeholder,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      ...props
    } = this.props;

    return (
      <FieldInput {...props}>
        <Input
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#a7a7a7"
          secureTextEntry={secure}
          onBlur={onFinishEditing}
        />
      </FieldInput>
    );
  }
}
