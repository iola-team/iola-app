import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import InputItem from '../Input';
import * as Yup from 'yup';

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

const valueFragment = gql`
  fragment FieldDate_data on ProfileFieldDateValue {
    dateValue: value
  }
`;

export default class FieldDate extends PureComponent {
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
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(valueFragment),
  };

  render() {
    const {
      field,
      ...props
    } = this.props;

    return (
      <InputItem
        {...props}
        type="date"
        placeholder={'Not specified'}
        label={field.label}
        minDate={new Date(field.configs.minDate)} // TODO: handle custom scalars on graph layer
        maxDate={new Date(field.configs.maxDate)} // TODO: handle custom scalars on graph layer
      />
    );
  }
}
