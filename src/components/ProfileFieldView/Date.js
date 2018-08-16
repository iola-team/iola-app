import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldViewDate_field on ProfileField {
    id
    label
  }
`;

const dataFragment = gql`
  fragment ProfileFieldViewDate_data on ProfileFieldDateValue {
    dateValue: value
  }
`;

export default class ProfileFieldViewDate extends PureComponent {
  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
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
        type="date"
        label={label}
        value={data && data.dateValue}
      />
    );
  }
}
