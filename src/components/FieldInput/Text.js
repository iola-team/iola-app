import React, { Component } from 'react';
import { isUndefined } from 'lodash';
import { Input } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import FieldInput from './FieldInput';

@styleSheet('Sparkle.TextInput', {
  button: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  }
})
export default class TextInput extends Component {
  onDone = value => {
    const { onChange } = this.props;

    this.hidePicker();
    onChange(value);
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
      <FieldInput isLoading={isUndefined(value)} {...props}>
        <Input
          multiline={multiline}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#a7a7a7"
          secureTextEntry={secure}
          onBlur={onFinishEditing}
        />
      </FieldInput>
    );
  }
}
