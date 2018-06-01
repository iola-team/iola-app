import React, { Component } from 'react';
import Moment from 'react-moment';
import { isUndefined } from 'lodash';
import { TouchableOpacity } from 'react-native';
import {
  Text,
} from 'native-base';

import InputItem from './Input';
import DatePicker from '../DatePicker';
import { withStyleSheet as styleSheet } from '../../theme'

@styleSheet('Sparkle.DateInput', {
  button: {
    flex: 1,
  }
})
export default class DateInput extends Component {
  state = {
    isPickerVisible: false,
  };

  showPicker = () => {
    this.setState({ isPickerVisible: true });
  };

  onDone = value => {
    this.hidePicker();

    this.props.onChange(value);
  }

  hidePicker = () => {
    this.setState({ isPickerVisible: false });
  };

  render() {
    const { isPickerVisible } = this.state;
    const {
      value,
      minDate,
      maxDate,
      label,
      placeholder,
      styleSheet,
      ...props
    } = this.props;

    return (
      <InputItem
        label={label}
        isLoading={isUndefined(value)}
        {...props}
      >
        <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
          <Text note={!value}>
            {value ? (
              <Moment format="MMMM D, YYYY">{value}</Moment>
            ): placeholder}
          </Text>
        </TouchableOpacity>

        <DatePicker
          isVisible={isPickerVisible}
          value={value}
          label={label}
          minDate={minDate}
          maxDate={maxDate}
          onDone={this.onDone}
          onSwipe={this.hidePicker}
          onCancel={this.hidePicker}
          onClose={this.hidePicker}
        />
      </InputItem>
    );
  }
}
