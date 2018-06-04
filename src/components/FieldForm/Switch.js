import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldSwitch_field on ProfileField {
    id
    label
  }
`;

const valueFragment = gql`
  fragment FieldSwitch_value on ProfileFieldSwitchValue {
    booleanValue: value,
  }
`;

export default class FieldDate extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  render() {
    const { field, value, onChange } = this.props;

    return (
      <InputItem
        type="switch"
        value={value && value.booleanValue}
        label={field.label}
        {...field.configs}
        onChange={value => onChange({ booleanValue: value })}
      />
    );
  }
}
