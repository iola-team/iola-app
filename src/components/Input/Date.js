import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Text,
} from 'native-base';

import InputItem from './Input';

export default class DateInput extends Component {
  render() {
    const {
      placeholder,
      ...props
    } = this.props;

    return (
      <InputItem
        {...props}
      >
        <TouchableOpacity>
          <Text note>
            {placeholder}
          </Text>
        </TouchableOpacity>
      </InputItem>
    );
  }
}
