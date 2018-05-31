import React, { Component, Fragment } from 'react';
import { find } from 'lodash';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  ListItem,
  Right,
  Body,
  Left,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import Input from './Input';
import ListPicker from '../ListPicker';

@styleSheet('Sparkle.SelectInput', {
  button: {
    flex: 1,
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
      ...props
    } = this.props;

    const value = rawValue || [];
    const selectedLabels = value.map(value => find(options, { value }).label)

    return (
      <Fragment>
        <Input
          label={label}
          {...props}
        >
          <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
            <Text note={!value.length}>
              {!!value.length ? selectedLabels.join(', ') : placeholder}
            </Text>
          </TouchableOpacity>
        </Input>

        <ListPicker
          isVisible={this.state.isPickerVisible}
          value={value}
          label={label}
          options={options}
          multiple={multiple}
          onDone={this.onDone}
          onSwipe={this.hidePicker}
          onCancel={this.hidePicker}
        />
      </Fragment>
    );
  }
}
