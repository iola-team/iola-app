import React, { Component } from 'react';
import { isUndefined } from 'lodash';
import {
  Switch,
} from 'native-base';

import InputItem from './Input';

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
      <InputItem
        isLoading={isUndefined(value)}
        {...props}
      >
        <Switch value={value} onValueChange={this.onChange} />
      </InputItem>
    );
  }
}
