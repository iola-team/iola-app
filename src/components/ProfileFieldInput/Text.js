import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { Platform } from 'react-native';

import FieldInput from '../FieldInput';

const fieldFragment = gql`
  fragment ProfileFieldInputText_field on ProfileField {
    id
    label
    isRequired
    configs {
      ...on ProfileFieldTextConfigs {
        format
        secure
        regexp
        multiline
        minLength
        maxLength
      }
    }
  }
`;

const dataFragment = gql`
  fragment ProfileFieldInputText_data on ProfileFieldTextValue {
    stringValue: value
  }
`;

const keyboardTypes = {
  'EMAIL': 'email-address',
  'URL': Platform.select({
    ios: 'url',
    default: 'default',
  }),
};

export default class ProfileFieldInputText extends Component {
  static formOptions({ field, data }) {
    const { minLength, maxLength, regexp, format } = field.configs;
    let validationSchema = Yup.string();

    if (minLength) {
      validationSchema = validationSchema.min(minLength);
    }

    if (maxLength) {
      validationSchema = validationSchema.max(maxLength);
    }

    if (regexp) {
      validationSchema = validationSchema.matches(new RegExp(regexp), {
        excludeEmptyString: true,
      });
    }

    if (format === 'EMAIL') {
      validationSchema = validationSchema.email();
    }

    if (format === 'URL') {
      validationSchema = validationSchema.url();
    }

    return {
      validationSchema,
      initialValue: data?.stringValue,
      transformResult: value => ({ stringValue: value }),
    };
  }

  static fragments = {
    field: fieldFragment,
    data: dataFragment,
  };

  static propTypes = {
    input: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    error: PropTypes.string,
    field: fragmentProp(fieldFragment).isRequired,
    data: fragmentProp(dataFragment),
  };

  static defaultProps = {
    input: undefined,
    error: undefined,
    data: undefined,
  };

  render() {
    const { field, data, input, ...props } = this.props;
    const { format, ...fieldConfigs } = field.configs;
    const extraProps = ['URL', 'EMAIL'].includes(format) ? {
      keyboardType: keyboardTypes[format],
      autoCapitalize: 'none',
      autoCorrect: false,
    } : {};

    return (
      <FieldInput
        {...props}
        {...fieldConfigs}
        {...extraProps}

        type="text"
        placeholder="Enter here..."
        label={field.label}
        value={input === undefined ? data?.stringValue : input}
      />
    );
  }
}
