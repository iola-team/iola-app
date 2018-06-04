import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import Yup from 'yup';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldText_field on ProfileField {
    id
    label
    isRequired
    configs {
      ...on ProfileFieldTextConfigs {
        secure
        regexp
        multiline
        minLength
        maxLength
      }
    }
  }
`;

const dataFragment = gql`
  fragment FieldText_data on ProfileFieldTextValue {
    stringValue: value
  }
`;

export default class FieldText extends Component {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.string(),
      initialValue: data && data.stringValue,
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    error: PropTypes.string,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  render() {
    const { field, value, error, onChange } = this.props;
    console.log(`Text Error (${field.id})`, error);

    return (
      <InputItem
        type="text"
        value={value}
        placeholder="Enter here..."
        label={field.label}
        {...field.configs}
        onChange={onChange}
      />
    );
  }
}
