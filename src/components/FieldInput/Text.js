import React, { Component, Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import { isUndefined } from 'lodash';
import { Input, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import FieldInput from './FieldInput';
import TextPicker from '../TextPicker';

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
    const { onChange } = this.props;

    this.hidePicker();
    onChange(value);
  }

  renderMultilineInput() {
    const {
      value,
      label,
      placeholder,
      styleSheet,
      onFinishEditing,
    } = this.props;

    const { isPickerVisible } = this.state;
    const preview = value && value.trim();

    return (
      <Fragment>
        <TouchableOpacity style={styleSheet.button} onPress={this.showPicker}>
          <Text note={!preview}>
            {preview || placeholder}
          </Text>
        </TouchableOpacity>

        <TextPicker
          isVisible={isPickerVisible}
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
      <FieldInput
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
      </FieldInput>
    );
  }
}
