import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldDate_field on ProfileField {
    id
    label
    configs {
      ...on ProfileFieldDateConfigs {
        minDate
        maxDate
      }
    }
  }
`;

const valueFragment = gql`
  fragment FieldDate_value on ProfileFieldValue {
    id
    data {
      ...on ProfileFieldDateValue {
        date: value
      }
    }
  }
`;

export default class FieldDate extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  render() {
    const { field, value, ...props } = this.props;
    const inputValue = value && value.data.date;

    return (
      <InputItem
        type="date"
        value={inputValue}
        placeholder="Not specified"
        label={field.label}
        {...field.configs}
        onChange={(value) => {
          console.log(`${field.label} = ${value}`)
        }}
      />
    );
  }
}
