import React, { Component, Fragment } from 'react';
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
    height: 50,
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

  render() {
    const {
      label,
      options,
      placeholder,
      styleSheet,
      ...props
    } = this.props;

    return (
      <Fragment>
        <Input
          label={label}
          {...props}
        >
          <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
            <Text note>
              {placeholder}
            </Text>
          </TouchableOpacity>
        </Input>

        <ListPicker
          isVisible={this.state.isPickerVisible}
          label={label}
          options={options}
        />
      </Fragment>
    );
  }
}
