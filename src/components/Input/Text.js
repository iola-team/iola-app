import React, { Component, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { Input, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import InputItem from './Input';
import TextPicker from '../TextPicker';
import TouchableOpacity from '../TouchableOpacity';

@styleSheet('Sparkle.TextInput', {
  button: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  }
})
export default class TextInput extends Component {
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

  renderMultilineInput() {
    const {
      value,
      label,
      placeholder,
      styleSheet,
      onFinishEditing,
    } = this.props;

    const preview = value && value.trim();

    return (
      <Fragment>
        <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
          <Text note={!preview}>
            {preview || placeholder}
          </Text>
        </TouchableOpacity>

        <TextPicker
          isVisible={this.state.isPickerVisible}
          value={value}
          label={label}
          placeholder={placeholder}
          onDone={this.onDone}
          onSwipe={this.hidePicker}
          onCancel={this.hidePicker}
          onClose={this.hidePicker}
          onHide={onFinishEditing}
        />
      </Fragment>
    );
  }

  render() {
    const {
      value,
      onChange,
      onFinishEditing,
      secure,
      multiline,
      placeholder,
      ...props
    } = this.props;

    return (
      <InputItem
        isLoading={isUndefined(value)}
        {...props}
      >
        {
          multiline ? this.renderMultilineInput() : (
            <Input
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#a7a7a7"
              secureTextEntry={secure}
              onBlur={onFinishEditing}
            />
          )
        }
      </InputItem>
    );
  }
}
