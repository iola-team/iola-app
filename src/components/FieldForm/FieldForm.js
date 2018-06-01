import React, { Component } from 'react';
import { groupBy, map, first } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import Section from './Section';
import Field from './Field';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

const fieldFragment = gql`
  fragment FieldForm_field on ProfileField {
    id
    name
    label
    section {
      id
      label
    }

    ...Field_field
  }
  
  ${Field.fragments.field}
`;

const valueFragment = gql`
  fragment FieldForm_value on ProfileFieldValue {
    id
    field {
      id
    }

    ...Field_value
  }

  ${Field.fragments.value}
`;

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.FieldForm', {
  root: {

  }
})
export default class FieldForm extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ).isRequired,

    values: PropTypes.arrayOf(
      fragmentProp(valueFragment)
    ),
  };

  render() {
    const { style, fields: profileFields, values = [] } = this.props;
    const valuesByField = groupBy(values, 'field.id');
    const sections = map(
      groupBy(profileFields, 'section.id'),
      fields => ({
        ...fields[0].section,
        fields,
      }),
    );

    return (
      <Root style={style}>
        {
          sections.map(({ id, label, fields }) => (
            <Section key={id} label={label}>
              {
                fields.map(field => (
                  <Field key={field.id} field={field} value={first(valuesByField[field.id])} />
                ))
              }
            </Section>
          ))
        }
      </Root>
    );
  }
}
