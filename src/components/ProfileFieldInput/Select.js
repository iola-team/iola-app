import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';

import FieldInput from '../FieldInput';

const fieldFragment = gql`
  fragment ProfileFieldInputSelect_field on ProfileField {
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
  fragment ProfileFieldInputSelect_data on ProfileFieldSelectValue {
    arrayValue: value
  }
`;

export default class ProfileFieldInputSelect extends PureComponent {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.array(),
      initialValue: data?.arrayValue,
      transformResult: value => ({ arrayValue: value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    input: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  static defaultProps = {
    input: undefined,
    data: undefined,
  };

  render() {
    const { field, data, input, ...props } = this.props;

    return (
      <FieldInput
        {...props}
        {...field.configs}

        type="select"
        placeholder="Not specified"
        label={field.label}
        value={input === undefined ? data?.arrayValue : input}
      />
    );
  }
}
