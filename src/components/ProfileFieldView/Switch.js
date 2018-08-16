import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldViewSwitch_field on ProfileField {
    id
    label
  }
`;

const valueFragment = gql`
  fragment ProfileFieldViewSwitch_data on ProfileFieldSwitchValue {
    booleanValue: value
  }
`;

export default class ProfileFieldViewSwitch extends PureComponent {
  static fragments = {
    field: fieldFragment,
    data: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(valueFragment),
  };

  static defaultProps = {
    data: {
      booleanValue: undefined,
    },
  };

  render() {
    const {
      field: { label },
      data: { booleanValue },
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="switch"
        label={label}
        value={booleanValue}
      />
    );
  }
}
