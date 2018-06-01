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

export default class FieldSelect extends Component {
  static fragments = {
    field: fieldFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired
  };

  render() {
    const { field, ...props } = this.props;

    return (
      <InputItem
        type="select"
        placeholder="Not specified"
        label={field.label}
        {...field.configs}
        onChange={(value) => {
          console.log(`${field.label} = ${value}`)
        }}
      />
    );
  }
}
