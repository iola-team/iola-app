import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';

import FieldInput from '../FieldInput';

const fieldFragment = gql`
  fragment ProfileFieldInputSwitch_field on ProfileField {
    id
    label
  }
`;

const dataFragment = gql`
  fragment ProfileFieldInputSwitch_data on ProfileFieldSwitchValue {
    booleanValue: value,
  }
`;

export default class ProfileFieldInputSwitch extends PureComponent {
  static formOptions({ field, data }) {
    return {
      validationSchema: Yup.boolean(),
      initialValue: data && data.booleanValue,
      transformResult: value => ({ booleanValue: !!value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    input: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  render() {
    const {
      field,
      data,
      input,
      ...props,
    } = this.props;

    return (
      <FieldInput
        {...props}
        {...field.configs}

        type="switch"
        label={field.label}
        value={input || data && data.booleanValue}
      />
    );
  }
}
