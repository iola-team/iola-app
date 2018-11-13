import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, constant, identity } from 'lodash';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import ProfileFieldInput from '../ProfileFieldInput';

const fieldFragment = gql`
  fragment ProfileFieldFormField_field on ProfileField {
    id
    ...ProfileFieldInput_field
  }
  
  ${ProfileFieldInput.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldFormField_value on ProfileFieldValue {
    id
    ...ProfileFieldInput_value
  }

  ${ProfileFieldInput.fragments.value}
`;

export default class Field extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  static getFormOptions(props) {
    const formOptionsGetter = isFunction(ProfileFieldInput.formOptions)
      ? ProfileFieldInput.formOptions
      : constant(ProfileFieldInput.formOptions || {});

    return {
      initialValue: undefined,
      transformResult: identity,
      ...formOptionsGetter(props)
    };
  }

  onChange = (value) => {
    const { field, form } = this.props;

    form.setFieldValue(field.id, value);
  };

  onError = (error) => {
    const { field, form } = this.props;

    form.setFieldError(field.id, error);
  };

  onFinishEditing = () => {
    const { field, form } = this.props;

    form.setFieldTouched(field.id);
  };

  render() {
    const { field, form, ...props } = this.props;
    const isTouched = form.touched[field.id];
    const error = isTouched && form.errors[field.id];

    return (
      <ProfileFieldInput
        {...props}
        field={field}
        input={form.values[field.id]}
        error={error}
        onChange={this.onChange}
        onError={this.onError}
        onFinishEditing={this.onFinishEditing}
      />
    );
  }
}
