import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export default class Field extends Component {
  static fragments = {
    field: fieldFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired
  };

  render() {
    const { field, ...props } = this.props;
    const Component = types[field.presentation];

    return (
      <Component field={field} />
    );
  }
}
