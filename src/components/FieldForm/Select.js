import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';
import * as Yup from 'yup';

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

export default class FieldSelect extends PureComponent {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.array(),
      initialValue: data && data.arrayValue,
      transformResult: value => ({ arrayValue: value }),
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
    const { field, ...props } = this.props;

    return (
      <InputItem
        {...props}
        type="select"
        placeholder="Not specified"
        label={field.label}
        {...field.configs}
      />
    );
  }
}
