import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';

import FieldInput from '../FieldInput';

const fieldFragment = gql`
  fragment ProfileFieldInputDate_field on ProfileField {
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

const valueFragment = gql`
  fragment ProfileFieldInputDate_data on ProfileFieldDateValue {
    dateValue: value
  }
`;

export default class FieldDate extends Component {
  static formOptions({ field, data }) {
    const { minDate, maxDate } = field.configs;
    let validationSchema = Yup.date();

    if (minDate) {
      validationSchema = validationSchema.min(minDate);
    }

    if (maxDate) {
      validationSchema = validationSchema.max(maxDate);
    }

    return {
      validationSchema,
      initialValue: data && new Date(data.dateValue), // TODO: handle custom scalars on graph layer
      transformResult: value => ({ dateValue: value.toISOString() }), // TODO: handle custom scalars on graph layer
    };
  }

  static fragments = {
    field: fieldFragment,
    data: valueFragment,
  };

  static propTypes = {
    input: PropTypes.any,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(valueFragment),
  };

  static defaultProps = {
    input: undefined,
    data: undefined,
  };

  render() {
    const { field, data, input, ...props } = this.props;
    const value = input === undefined ? data && new Date(data.dateValue) : input; // TODO: handle custom scalars on graph layer

    return (
      <FieldInput
        {...props}

        type="date"
        placeholder="Not specified"
        label={field.label}
        value={value}
        minDate={new Date(field.configs.minDate)} // TODO: handle custom scalars on graph layer
        maxDate={new Date(field.configs.maxDate)} // TODO: handle custom scalars on graph layer
      />
    );
  }
}
