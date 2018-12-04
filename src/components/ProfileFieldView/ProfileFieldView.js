import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

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
  fragment ProfileFieldView_field on ProfileField {
    id
    presentation

    ...ProfileFieldViewText_field
    ...ProfileFieldViewSelect_field
    ...ProfileFieldViewDate_field
    ...ProfileFieldViewSwitch_field
  }

  ${Text.fragments.field}
  ${Select.fragments.field}
  ${Date.fragments.field}
  ${Switch.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldView_value on ProfileFieldValue {
    id
    data {
      ...ProfileFieldViewText_data
      ...ProfileFieldViewSelect_data
      ...ProfileFieldViewDate_data
      ...ProfileFieldViewSwitch_data
    }
  }

  ${Text.fragments.data}
  ${Select.fragments.data}
  ${Date.fragments.data}
  ${Switch.fragments.data}
`;

const getFieldComponent = ({ field }) => types[field.presentation];

export default class ProfileFieldView extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    value: fragmentProp(valueFragment),
  };

  static defaultProps = {
    value: null,
  };

  render() {
    const { value, field, ...props } = this.props;
    const FieldComponent = getFieldComponent(this.props);

    return (
      <FieldComponent
        {...props}
        field={field}
        data={value && value.data}
      />
    );
  }
}
