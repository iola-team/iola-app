import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, constant, identity } from 'lodash';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import SelectInput from './Select';
import TextInput from './Text';
import DateInput from './Date';
import SwitchInput from './Switch';

const types = {
  'TEXT': TextInput,
  'DATE': DateInput,
  'SELECT': SelectInput,
  'SWITCH': SwitchInput,
};

const fieldFragment = gql`
  fragment Field_field on ProfileField {
    id
    presentation
    
    ...FieldText_field
    ...FieldSelect_field
    ...FieldDate_field
    ...FieldSwitch_field
  }
  
  ${TextInput.fragments.field}
  ${SelectInput.fragments.field}
  ${DateInput.fragments.field}
  ${SwitchInput.fragments.field}
`;

const dataFragment = gql`
  fragment Field_data on ProfileFieldValueData {
    ...FieldText_data
    ...FieldSelect_data
    ...FieldDate_data
    ...FieldSwitch_data
  }

  ${TextInput.fragments.data}
  ${SelectInput.fragments.data}
  ${DateInput.fragments.data}
  ${SwitchInput.fragments.data}
`;

const getFieldComponent = ({ field }) => types[field.presentation];

export default class Field extends Component {
  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  static getFormOptions(props) {
    const Component = getFieldComponent(props);
    const formOptionsGetter = isFunction(Component.formOptions)
      ? Component.formOptions
      : constant(Component.formOptions || {});

    return {
      initialValue: undefined,
      transformResult: identity,
      ...formOptionsGetter(props),
    };
  }

  render() {
    const { field, form } = this.props;
    const Component = getFieldComponent(this.props);

    return (
      <Component
        {...this.props}
        value={form.values[field.id]}
        error={form.errors[field.id]}
        onChange={value => form.setFieldValue(field.id, value)}
        onError={error => form.setFieldError(field.id, error)}
      />
    );
  }
}
