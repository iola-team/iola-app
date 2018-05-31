import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Input,
  Text,
} from 'native-base';

import InputItem from './Input';

export default class TextInput extends Component {
  renderMultilineInput() {
    const {
      placeholder,
    } = this.props;

    return (
      <TouchableOpacity>
        <Text note={!!placeholder}>
          {placeholder}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      value,
      onChange,

      secure,
      multiline,
      placeholder,
      ...props
    } = this.props;

    return (
      <InputItem
        {...props}
      >
        {
          multiline ? this.renderMultilineInput() : (
            <Input
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={'#a7a7a7'}
              secureTextEntry={secure}
            />
          )
        }
      </InputItem>
    );
  }
}
