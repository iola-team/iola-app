import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Text,
} from 'native-base';

import InputItem from './Input';
import DatePicker from '../DatePicker';

export default class DateInput extends Component {
  state = {
    isPickerVisible: false,
  };

  showPicker = () => {
    this.setState({ isPickerVisible: true });
  };

  hidePicker = () => {
    this.setState({ isPickerVisible: false });
  };

  render() {
    const { isPickerVisible } = this.state;
    const {
      minDate,
      maxDate,
      label,
      placeholder,
      ...props
    } = this.props;

    return (
      <InputItem
        label={label}
        {...props}
      >
        <TouchableOpacity onPress={this.showPicker}>
          <Text note>
            {placeholder}
          </Text>
        </TouchableOpacity>

        <DatePicker
          isVisible={isPickerVisible}
          label={label}
          minDate={minDate}
          maxDate={maxDate}
          onDone={this.hidePicker}
        />
      </InputItem>
    );
  }
}
