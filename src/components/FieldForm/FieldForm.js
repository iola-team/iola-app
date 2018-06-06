import React, { Component } from 'react';
import { groupBy, map, first, isUndefined, get, noop } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import Yup from 'yup';
import {
  View,
  Text,
  Button,
} from 'native-base';

import Formik from './Formik';
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
    const dataByField = getDataByField(profileFields, values);
    const fieldSchemas = {};
    const initialValues = {};

    mapFieldOptions(profileFields, dataByField, (options, field) => {
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
          const resultValues = mapFieldOptions(profileFields, dataByField, ((options, { id }) => (
            options.transformResult(values[id])
          )));

          const result = await onSubmit(resultValues);
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
                        data={dataByField[field.id]}
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
