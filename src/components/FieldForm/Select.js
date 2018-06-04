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
  fragment FieldSelect_value on ProfileFieldSelectValue {
    arrayValue: value
  }
`;

export default class FieldSelect extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  onChange = (value) => {
    const { onChange, onError } = this.props;

    return onChange({
      arrayValue: value,
    });
  }

  render() {
    const { field, value, onChange } = this.props;

    return (
      <InputItem
        type="select"
        value={value && value.arrayValue}
        placeholder="Not specified"
        label={field.label}
        {...field.configs}
        onChange={this.onChange}
      />
    );
  }
}
