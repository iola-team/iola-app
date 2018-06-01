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

export default class FieldDate extends Component {
  static fragments = {
    field: fieldFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired
  };

  render() {
    const { field, ...props } = this.props;

    console.log('Date', field);

    return (
      <InputItem
        type="date"
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
