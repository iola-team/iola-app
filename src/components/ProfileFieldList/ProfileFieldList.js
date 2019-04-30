import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { groupBy, map, get } from 'lodash';

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

export default class ProfileFieldList extends PureComponent {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ),

    values: PropTypes.arrayOf(
      fragmentProp(valueFragment).isRequired
    ),

    filterItems: PropTypes.func,
  };

  static defaultProps = {
    fields: null,
    values: null,
    filterItems: () => true,
  };


  /**
   * TODO: Memo result
   */
  buildSections(fields, values) {
    return map(
      groupBy(fields, 'section.id'),
      (sectionFields) => {
        const [{ section }] = sectionFields;

        return {
          key: section.id,
          label: section.label,
          items: this.buildItems(sectionFields, values),
        };
      },
    );
  }

  buildItems(fields, values) {
    const { filterItems } = this.props;
    const valuesByField = this.buildValues(fields, values);

    return fields.map((field, index) => ({
      field,
      value: valuesByField[field.id],
      last: fields.length === (index + 1),
    })).filter(filterItems);
  }

  buildValues(fields, values) {
    const groupedByField = groupBy(values || [], 'field.id');

    return fields.reduce((result, field) => ({
      ...result,
      [field.id]: values && get(groupedByField, [field.id, 0], null),
    }), {});
  }

  render() {
    const { fields, values, ...props } = this.props;
    const isLoaded = fields !== null && values !== null;
    const sections = isLoaded ? this.buildSections(fields, values) : null;

    return (
      <FieldList {...props} sections={sections} />
    );
  }
}
