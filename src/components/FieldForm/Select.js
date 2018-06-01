import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldSelect_field on ProfileField {
    id
    label
    configs {
      ...on ProfileFieldSelectConfigs {
        multiple
        options {
          label
          value
        }
      }
    }
  }
`;

const valueFragment = gql`
  fragment FieldSelect_value on ProfileFieldValue {
    id
    data {
      ...on ProfileFieldSelectValue {
        selectedOptions: value
      }
    }
  }
`;

export default class FieldSelect extends Component {
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

    return (
      <InputItem
        type="select"
        value={value && value.data.selectedOptions}
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
