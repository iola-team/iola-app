import React, { Component } from 'react';
import { Switch } from 'native-base';

import FieldInput from './FieldInput';

export default class SwitchInput extends Component {
  onChange = (value) => {
    const { onFinishEditing, onChange } = this.props;

    onChange(value);
    onFinishEditing();
  }

  render() {
    const {
      value,
      ...props
    } = this.props;

    return (
      <FieldInput {...props}>
        <Switch value={value} onValueChange={this.onChange} />
      </FieldInput>
    );
  }
}
