import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { isFunction } from 'lodash';

import Select from './Select';
import Text from './Text';
import Date from './Date';
import Switch from './Switch';

const types = {
  'TEXT': Text,
  'DATE': Date,
  'SELECT': Select,
  'SWITCH': Switch,
};

const fieldFragment = gql`
  fragment ProfileFieldInput_field on ProfileField {
    id
    presentation

    ...ProfileFieldInputText_field
    ...ProfileFieldInputSelect_field
    ...ProfileFieldInputDate_field
    ...ProfileFieldInputSwitch_field
  }

  ${Text.fragments.field}
  ${Select.fragments.field}
  ${Date.fragments.field}
  ${Switch.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldInput_value on ProfileFieldValue {
    id
    data {
      ...ProfileFieldInputText_data
      ...ProfileFieldInputSelect_data
      ...ProfileFieldInputDate_data
      ...ProfileFieldInputSwitch_data
    }
  }

  ${Text.fragments.data}
  ${Select.fragments.data}
  ${Date.fragments.data}
  ${Switch.fragments.data}
`;

const getFieldComponent = ({ field }) => types[field.presentation];

export default class ProfileFieldInput extends PureComponent {
  static formOptions({ value, ...restProps }) {
    const props = {
      ...restProps,
      data: value && value.data,
    };

    const Field = getFieldComponent(props);

    return isFunction(Field.formOptions)
      ? Field.formOptions(props)
      : Field.formOptions || {};
  };

  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    input: PropTypes.any,
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  static defaultProps = {
    input: undefined,
    value: undefined,
  };

  render() {
    const { value, field, input, ...props } = this.props;
    const Field = getFieldComponent(this.props);

    return (
      <Field
        {...props}
        input={input}
        field={field}
        data={value?.data}
      />
    );
  }
}
