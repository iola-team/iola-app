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

export default class FieldText extends Component {
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
        type="text"
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
