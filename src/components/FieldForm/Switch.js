import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';

const fieldFragment = gql`
  fragment FieldSwitch_field on ProfileField {
    id
    label
  }
`;

export default class FieldDate extends Component {
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
        type="switch"
        label={field.label}
        {...field.configs}
        onChange={(value) => {
          console.log(`${field.label} = ${value}`)
        }}
      />
    );
  }
}
