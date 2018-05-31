import React, { Component } from 'react';
import {
  Switch,
} from 'native-base';

import InputItem from './Input';

export default class SwitchInput extends Component {
  render() {
    const {
      value,
      onChange,
      ...props
    } = this.props;

    return (
      <InputItem
        {...props}
      >
        <Switch value={value} onValueChange={onChange} />
      </InputItem>
    );
  }
}
