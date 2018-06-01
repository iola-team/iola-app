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
  fragment FieldSwitch_value on ProfileFieldValue {
    id
    data {
      ...on ProfileFieldSwitchValue {
        isSwitched: value
      }
    }
  }
`;

export default class FieldDate extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  render() {
    const { field, value, ...props } = this.props;

    return (
      <InputItem
        type="switch"
        value={value && value.data.isSwitched}
        label={field.label}
        {...field.configs}
        onChange={(value) => {
          console.log(`${field.label} = ${value}`)
        }}
      />
    );
  }
}
