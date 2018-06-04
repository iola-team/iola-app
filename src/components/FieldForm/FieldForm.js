import React, { Component } from 'react';
import { groupBy, map, first, isUndefined, get } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Formik } from 'formik';
import Yup from 'yup';
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
    isRequired
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

    data {
      ...Field_data
    }
  }

  ${Field.fragments.data}
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

  getFieldOptions(field, data) {
    return Field.getFormOptions({
      field,
      data,
    });
  }

  renderField(field, data, form) {

    return (
      <Field
        key={field.id}
        field={field}
        data={data}
        form={form}
      />
    );
  }

  render() {
    const { style, fields: profileFields, values } = this.props;
    const valuesByField = groupBy(values || [], 'field.id');
    const dataByField = profileFields.reduce((result, { id }) => ({
      ...result,
      [id]: values && get(valuesByField, [id, 0, 'data'], null),
    }), {})

    const initialValues = profileFields.reduce((result, field) => {
      const { initialValue } = this.getFieldOptions(field, dataByField[field.id]);

      return {
        ...result,
        [field.id]: initialValue,
      };
    }, {});

    const sections = map(
      groupBy(profileFields, 'section.id'),
      fields => ({
        ...fields[0].section,
        fields,
      }),
    );

    const validationSchema = Yup.object().shape(profileFields.reduce((schema, field) => {
      const defaultValidationSchema = Yup.mixed().label(field.label).nullable();
      let { validationSchema = Yup.mixed() } = this.getFieldOptions(field, dataByField[field.id]);

      if (field.isRequired) {
        validationSchema = validationSchema.required();
      }

      return {
        ...schema,
        [field.id]: defaultValidationSchema.concat(validationSchema),
      };
    }, {}));

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}

        onSubmit={(values, bag) => {
          console.log('Submit', values, bag);
        }}
      >
        {form => (
          <Root style={style}>
            {
              sections.map(({ id, label, fields }) => (
                <Section key={id} label={label}>
                  {
                    fields.map(field => this.renderField(field, dataByField[field.id], form))
                  }
                </Section>
              ))
            }
            <Button onPress={() => form.submitForm()}><Text>Submit</Text></Button>
          </Root>
        )}
      </Formik>
    );
  }
}
