import React, { Component } from 'react';
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
        format
      }
    }
  }
`;

const dataFragment = gql`
  fragment ProfileFieldViewText_data on ProfileFieldTextValue {
    stringValue: value
  }
`;

const displayTypes = {
  'EMAIL': 'email',
  'URL': 'url',
};

export default class ProfileFieldViewText extends Component {
  static fieldOptions = {
    isEmpty: ({ stringValue }) => !stringValue?.trim().length,
  };

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  static defaultProps = {
    data: null,
  };

  render() {
    const {
      field: { label, configs: { secure, multiline, format } },
      data,
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
        type="text"
        displayType={format && displayTypes[format]}
        secure={secure}
        multiline={multiline}
        label={label}
        value={data?.stringValue}
      />
    );
  }
}
