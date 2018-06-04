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
  fragment FieldText_value on ProfileFieldTextValue {
    stringValue: value
  }
`;

export default class FieldText extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment
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
      stringValue: value,
    });
  }

  render() {
    const { field, value } = this.props;

    return (
      <InputItem
        type="text"
        value={value && value.stringValue}
        placeholder="Enter here..."
        label={field.label}
        {...field.configs}
        onChange={this.onChange}
      />
    );
  }
}
