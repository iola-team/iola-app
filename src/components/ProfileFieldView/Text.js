import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldViewText_field on ProfileField {
    id
    label
    configs {
      ...on ProfileFieldTextConfigs {
        multiline
        secure
      }
    }
  }
`;

const dataFragment = gql`
  fragment ProfileFieldViewText_data on ProfileFieldTextValue {
    stringValue: value
  }
`;

export default class ProfileFieldViewText extends PureComponent {
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
      field: { label, configs: { secure, multiline } },
      data,
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="text"
        secure={secure}
        multiline={multiline}
        label={label}
        value={data && data.stringValue}
      />
    );
  }
}
