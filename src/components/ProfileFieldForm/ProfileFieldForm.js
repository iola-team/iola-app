import React, { Component } from 'react';
import { groupBy, map, first, isUndefined, get, noop, filter } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import {
  View,
  Text,
  Button,
} from 'native-base';

import Section from '../FieldSection';
import Formik from './Formik';
import Field from './Field';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const getValuesByField = (fields, values) => {
  const groups = groupBy(values || [], 'field.id');

  return fields.reduce((result, { id }) => ({
    ...result,
    [id]: values && get(groups, [id, 0], null),
  }), {})
};

const mapFieldOptions = (fields, valuesList, mapper) => fields.reduce((result, field) => {
  const value = valuesList[field.id];
  const options = Field.getFormOptions({ field, value });

  return {
    ...result,
    [field.id]: mapper(options, field, value),
  };
}, {});

const fieldFragment = gql`
  fragment ProfileFieldForm_field on ProfileField {
    id
    name
    label
    isRequired
    section {
      id
      label
    }

    ...ProfileFieldFormField_field
  }
  
  ${Field.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldForm_value on ProfileFieldValue {
    id
    field {
      id
    }

    ...ProfileFieldFormField_value
  }

  ${Field.fragments.value}
`;

@styleSheet('Sparkle.ProfileFieldForm')
export default class ProfileFieldForm extends Component {
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
    onSubmitError: PropTypes.func,
    onFormReady: PropTypes.func,
  };

  static defaultProps = {
    onFormReady: noop,
    onSubmitError: noop,
  };

  form = null;
  onFormReady = (formRef) => {
    this.form = formRef;

    this.props.onFormReady({
      get isDirty() {
        return formRef.getFormikBag().dirty;
      },
      submit: this.submit,
    });
  };

  submit = () => {
    return this.form.submitForm();
  }

  render() {
    const { style, fields: profileFields, values, onSubmit, onSubmitError } = this.props;
    const valuesByField = getValuesByField(profileFields, values);
    const fieldSchemas = {};
    const initialValues = {};

    mapFieldOptions(profileFields, valuesByField, (options, field) => {
      const { id, isRequired, label } = field;

      fieldSchemas[id] = (options.validationSchema || Yup.mixed()).nullable().label(label);
      fieldSchemas[id] = isRequired ? fieldSchemas[id].required() : fieldSchemas[id];

      initialValues[id] = options.initialValue;
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
        ref={this.onFormReady}
        enableReinitialize
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={validationSchema}

        onSubmitError={onSubmitError}
        onSubmit={async (values, bag) => {
          const changedFields = filter(profileFields, ({ id }) => values[id] !== initialValues[id]);
          const resultValues = mapFieldOptions(changedFields, valuesByField, ((options, { id }) => ({
            ...options.transformResult(values[id]),
            fieldId: id,
          })));

          const result = await onSubmit(Object.values(resultValues));
          bag.setSubmitting(false);

          return result;
        }}
      >
        {form => (
          <View style={style}>
            {
              sections.map(({ id, label, fields }) => (
                <Section key={id} label={label}>
                  {
                    fields.map((field, index) => (
                      <Field
                        key={field.id}
                        field={field}
                        value={valuesByField[field.id]}
                        form={form}
                        last={fields.length === (index + 1)}
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
