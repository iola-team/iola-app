import React, { PureComponent } from 'react';
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

export default class FieldText extends PureComponent {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.string().min(2),
      initialValue: data && data.stringValue,
      transformResult: value => ({ stringValue: value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    error: PropTypes.string,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  render() {
    const {
      field,
      ...props,
    } = this.props;

    return (
      <InputItem
        {...props}
        type="text"
        placeholder="Enter here..."
        label={field.label}
        {...field.configs}
      />
    );
  }
}
