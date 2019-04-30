import React, { PureComponent } from 'react';
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
  static fieldOptions = {
    isEmpty: ({ booleanValue }) => booleanValue === null,
  };

  static fragments = {
    field: fieldFragment,
    data: valueFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(valueFragment),
  };

  static defaultProps = {
    data: null,
  };

  render() {
    const {
      field: { label },
      data,
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="switch"
        label={label}
        value={data?.booleanValue}
      />
    );
  }
}
