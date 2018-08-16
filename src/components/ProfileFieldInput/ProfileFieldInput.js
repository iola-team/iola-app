import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { isFunction, get } from 'lodash';

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

export default class ProfileFieldInput extends Component {
  static formOptions(props) {
    const Component = getFieldComponent(props);

    return isFunction(Component.formOptions)
      ? Component.formOptions(props)
      : Component.formOptions || {};
  };

  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  render() {
    const { value, field, ...props } = this.props;
    const Component = getFieldComponent(this.props);

    console.log('Value', value);

    return (
      <Component
        {...props}
        field={field}
        data={value && value.data}
      />
    );
  }
}
