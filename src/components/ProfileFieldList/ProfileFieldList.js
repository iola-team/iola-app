import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN } from 'react-native';
import { groupBy, map } from 'lodash'

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

export default class ProfileFieldList extends Component {
  static fragments = {
    field: fieldFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ).isRequired,

    renderItem: PropTypes.func.isRequired,
    renderSection: PropTypes.func,
  };

  render() {
    const { style, fields, ...listProps } = this.props;
    const sections = map(
      groupBy(fields, 'section.id'),
      (fields) => {
        const section = fields[0].section;

        return {
          key: section.id,
          label: section.label,
          items: fields,
        };
      },
    );

    return (
      <ViewRN style={style}>
        <FieldList  {...listProps} sections={sections} />
      </ViewRN>
    );
  }
}
