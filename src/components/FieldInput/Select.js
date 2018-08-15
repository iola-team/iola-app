import React, { Component, Fragment } from 'react';
import { find, isUndefined } from 'lodash';
import { View, TouchableOpacity } from 'react-native';
import {
  Text,
  Button,
  ListItem,
  Right,
  Body,
  Left,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import FieldInput from './FieldInput';
import ListPicker from '../ListPicker';

@styleSheet('Sparkle.SelectInput', {
  button: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  }
})
export default class Select extends Component {
  state = {
    isPickerVisible: false,
  };

  showPicker = () => {
    this.setState({ isPickerVisible: true });
  };

  hidePicker = () => {
    this.setState({ isPickerVisible: false });
  };

  onDone = value => {
    this.hidePicker();

    this.props.onChange(value);
  }

  render() {
    const {
      value: rawValue,
      label,
      options,
      multiple,
      placeholder,
      styleSheet,
      onFinishEditing,
      ...props
    } = this.props;

    const value = rawValue || [];
    const selectedLabels = value.map(value => find(options, { value }).label)

    return (
      <Fragment>
        <FieldInput
          label={label}
          isLoading={isUndefined(rawValue)}
          {...props}
        >
          <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
            <Text note={!value.length}>
              {!!value.length ? selectedLabels.join(', ') : placeholder}
            </Text>
          </TouchableOpacity>
        </FieldInput>

        <ListPicker
          isVisible={this.state.isPickerVisible}
          value={value}
          label={label}
          options={options}
          multiple={multiple}
          onDone={this.onDone}
          onSwipe={this.hidePicker}
          onCancel={this.hidePicker}
          onRequestClose={this.hidePicker}
          onDismiss={onFinishEditing}
        />
      </Fragment>
    );
  }
}
