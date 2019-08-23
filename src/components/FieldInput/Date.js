import React, { Component } from 'react';
import Moment from 'react-moment';
import { Text } from 'native-base';

import { withStyleSheet } from '~theme';
import FieldInput from './FieldInput';
import DatePicker from '../DatePicker';
import TouchableOpacity from '../TouchableOpacity';

@withStyleSheet('iola.DateInput')
export default class DateInput extends Component {
  state = {
    isPickerVisible: false,
  };

  showPicker = () => {
    this.setState({ isPickerVisible: true });
  };

  onDone = value => {
    const { onChange } = this.props;

    this.hidePicker();
    onChange(value);
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
      onFinishEditing,
      ...props
    } = this.props;

    return (
      <FieldInput label={label} {...props}>
        <TouchableOpacity onPress={this.showPicker}>
          {
            value ? (
              <Moment element={Text} format="MMMM D, YYYY">{value}</Moment>
            ) : (
              <Text note>{placeholder}</Text>
            )
          }
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
          onRequestClose={this.hidePicker}
          onDismiss={onFinishEditing}
        />
      </FieldInput>
    );
  }
}
