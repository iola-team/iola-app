import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldViewSelect_field on ProfileField {
    id
    label
    
    configs {
      ...on ProfileFieldSelectConfigs {
        options {
          label
          value
        }
      }
    }
  }
`;

const valueFragment = gql`
  fragment ProfileFieldViewSelect_data on ProfileFieldSelectValue {
    arrayValue: value
  }
`;

export default class ProfileFieldViewSelect extends PureComponent {
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
      arrayValue: undefined,
    },
  };

  render() {
    const {
      field: { label, configs: { options } },
      data: { arrayValue },
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="select"
        options={options}
        label={label}
        value={arrayValue}
      />
    );
  }
}
