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

const getDataByField = (fields, values) => {
  const valuesByField = groupBy(values || [], 'field.id');

  return fields.reduce((result, { id }) => ({
    ...result,
    [id]: values && get(valuesByField, [id, 0, 'data'], null),
  }), {})
};

const mapFieldOptions = (fields, dataList, mapper) => fields.reduce((result, field) => {
  const data = dataList[field.id];
  const options = Field.getFormOptions({ field, data });

  return {
    ...result,
    [field.id]: mapper(options, field, data),
  };
}, {});

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

@styleSheet('Sparkle.FieldForm')
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

    onSubmit: PropTypes.func.isRequired,
  };

  form = null;

  submit() {
    return this.form.submitForm();
  }

  render() {
    const { style, fields: profileFields, values, onSubmit } = this.props;
    const dataByField = getDataByField(profileFields, values);
    const fieldSchemas = {};
    const initialValues = {};

    mapFieldOptions(profileFields, dataByField, ({ validationSchema, initialValue }, { id, isRequired }) => {
      fieldSchemas[id] = validationSchema || Yup.mixed();
      fieldSchemas[id] = isRequired ? fieldSchemas[id].required() : fieldSchemas[id];

      initialValues[id] = initialValue;
    });

    const validationSchema = Yup.object().shape(fieldSchemas);
    const sections = map(
      groupBy(profileFields, 'section.id'),
      fields => ({
        ...fields[0].section,
        fields,
      }),
    );

    return (
      <Formik
        ref={form => {
          this.form = form;
        }}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}

        onSubmit={(values, bag) => {
          const resultValues = mapFieldOptions(profileFields, dataByField, ((options, { id }) => (
            options.transformResult(values[id])
          )));

          return onSubmit(resultValues);
        }}
      >
        {form => (
          <View style={style}>
            {
              sections.map(({ id, label, fields }) => (
                <Section key={id} label={label}>
                  {
                    fields.map(field => (
                      <Field
                        key={field.id}
                        field={field}
                        data={dataByField[field.id]}
                        form={form}
                      />
                    ))
                  }
                </Section>
              ))
            }
          </View>
        )}
      </Formik>
    );
  }
}
