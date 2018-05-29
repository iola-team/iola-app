import React, { Component } from 'react';
import {
  Switch,
} from 'native-base';

import InputItem from './Input';

export default class SwitchInput extends Component {
  render() {
    const {
      ...props
    } = this.props;

    return (
      <InputItem
        {...props}
      >
        <Switch />
      </InputItem>
    );
  }
}
