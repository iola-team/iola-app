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
  fragment FieldDate_value on ProfileFieldDateValue {
    dateValue: value
  }
`;

export default class FieldDate extends Component {
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
      dateValue: value,
    });
  }

  render() {
    const { field, value } = this.props;

    return (
      <InputItem
        type="date"
        value={value && value.dateValue}
        placeholder={'Not specified'}
        label={field.label}
        {...field.configs}
        onChange={this.onChange}
      />
    );
  }
}
