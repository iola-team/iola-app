import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN } from 'react-native';
import { groupBy, map, get } from 'lodash'

import FieldList from '../FieldList';

const fieldFragment = gql`
  fragment ProfileFieldList_field on ProfileField {
    id
    section {
      id
      label
    }
  }
`;

const valueFragment = gql`
  fragment ProfileFieldList_value on ProfileFieldValue {
    id
    field {
      id
    }
  }
`;

export default class ProfileFieldList extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ).isRequired,

    values: PropTypes.arrayOf(
      fragmentProp(valueFragment).isRequired
    ),

    renderItem: PropTypes.func.isRequired,
    renderSection: PropTypes.func,
  };

  buildSections(fields, values) {
    return map(
      groupBy(fields, 'section.id'),
      (fields) => {
        const section = fields[0].section;

        return {
          key: section.id,
          label: section.label,
          items: this.buildItems(fields, values),
        };
      },
    );
  }

  buildItems(fields, values) {
    const valuesByField = this.buildValues(values);

    return fields.map(field => ({
      field,
      value: get(valuesByField, [field.id, 0]),
    }));
  }

  buildValues(values) {
    return groupBy(values, 'field.id');
  }

  render() {
    const { style, fields, values, ...listProps } = this.props;
    const sections = this.buildSections(fields, values);

    return (
      <ViewRN style={style}>
        <FieldList {...listProps} sections={sections} />
      </ViewRN>
    );
  }
}
