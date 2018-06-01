import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldText_field on ProfileField {
    id
    label
    configs {
      ...on ProfileFieldTextConfigs {
        secure
        multiline
        minLength
        maxLength
      }
    }
  }
`;

const valueFragment = gql`
  fragment FieldText_value on ProfileFieldValue {
    id
    data {
      ...on ProfileFieldTextValue {
        text: value
      }
    }
  }
`;

export default class FieldText extends Component {
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
    const inputValue = value && value.data.text;

    return (
      <InputItem
        type="text"
        value={inputValue}
        placeholder="Enter here..."
        label={field.label}
        {...field.configs}
        onChange={(value) => {
          console.log(`${field.label} = ${value}`)
        }}
      />
    );
  }
}
