import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';
import Yup from 'yup'

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

const dataFragment = gql`
  fragment FieldSelect_data on ProfileFieldSelectValue {
    arrayValue: value
  }
`;

export default class FieldSelect extends Component {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.array(),
      initialValue: data && data.arrayValue,
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  render() {
    const { field, value, onChange } = this.props;

    return (
      <InputItem
        type="select"
        value={value}
        placeholder="Not specified"
        label={field.label}
        {...field.configs}
        onChange={onChange}
      />
    );
  }
}
