import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import { isUndefined } from 'lodash';
import { TouchableOpacity } from 'react-native';
import {
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme'
import FieldInput from './FieldInput';
import DatePicker from '../DatePicker';

@styleSheet('Sparkle.DateInput', {
  button: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  }
})
export default class DateInput extends PureComponent {
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
      onFinishEditing,
      ...props
    } = this.props;

    return (
      <FieldInput
        label={label}
        isLoading={isUndefined(value)}
        {...props}
      >
        <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
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
