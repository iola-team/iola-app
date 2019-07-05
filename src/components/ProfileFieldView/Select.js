import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldViewSelect_field on ProfileField {
    id
    label
    
    configs {
      ...on ProfileFieldSelectConfigs {
        options {
          label
          value
        }
      }
    }
  }
`;

const valueFragment = gql`
  fragment ProfileFieldViewSelect_data on ProfileFieldSelectValue {
    arrayValue: value
  }
`;

export default class ProfileFieldViewSelect extends Component {
  static fieldOptions = {
    isEmpty: ({ arrayValue }) => !arrayValue?.length,
  };

  static fragments = {
    field: fieldFragment,
    data: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(valueFragment),
  };

  static defaultProps = {
    data: null,
  };

  render() {
    const {
      field: { label, configs: { options } },
      data,
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="select"
        options={options}
        label={label}
        value={data?.arrayValue}
      />
    );
  }
}
