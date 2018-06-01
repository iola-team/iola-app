import React, { Component } from 'react';
import { isUndefined } from 'lodash';
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
        isLoading={isUndefined(value)}
        {...props}
      >
        <Switch value={value} onValueChange={onChange} />
      </InputItem>
    );
  }
}
