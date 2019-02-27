import React, { Component } from 'react';
import { groupBy, get, noop, filter } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import * as Yup from 'yup';

import { withStyle } from '~theme';
import ProfileFieldList from '../ProfileFieldList';
import Formik from './Formik';
import Field from './Field';

const getValuesByField = (fields, values) => {
  const groups = groupBy(values || [], 'field.id');

  return fields.reduce((result, { id }) => ({
    ...result,
    [id]: values && get(groups, [id, 0], null),
  }), {});
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

    ...ProfileFieldList_field
    ...ProfileFieldFormField_field
  }
  
  ${Field.fragments.field}
  ${ProfileFieldList.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldForm_value on ProfileFieldValue {
    id
    field {
      id
    }

    ...ProfileFieldList_value
    ...ProfileFieldFormField_value
  }

  ${Field.fragments.value}
  ${ProfileFieldList.fragments.value}
`;

@withStyle('Sparkle.ProfileFieldForm')
export default class ProfileFieldForm extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  }

  static propTypes = {
    loading: PropTypes.bool,
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ),

    values: PropTypes.arrayOf(
      fragmentProp(valueFragment)
    ),

    onSubmit: PropTypes.func,
    onSubmitError: PropTypes.func,
    onFormReady: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    fields: [],
    values: [],
    onSubmit: noop,
    onFormReady: noop,
    onSubmitError: noop,
  };

  form = null;

  onFormReady = (formRef) => {
    const { onFormReady } = this.props;
    this.form = formRef;

    onFormReady({
      get isDirty() {
        return formRef.getFormikBag().dirty;
      },
      submit: this.submit,
    });
  };

  submit = () => this.form.submitForm();

  renderItem = form => ({ field, ...props }) => (
    <Field {...props} key={field.id} field={field} form={form} />
  );

  render() {
    const {
      fields: profileFields,
      values,
      onSubmit,
      onSubmitError,
      ...props
    } = this.props;

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
          <ProfileFieldList
            {...props}
            fields={profileFields}
            values={values}
            renderItem={this.renderItem(form)}
          />
        )}
      </Formik>
    );
  }
}
