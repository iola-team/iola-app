import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ProfileFieldList from '../ProfileFieldList';
import ProfileFieldView from '../ProfileFieldView';

const fieldFragment = gql`
  fragment ProfileFieldsView_field on ProfileField {
    id
    ...ProfileFieldList_field
    ...ProfileFieldView_field
  }
  
  ${ProfileFieldView.fragments.field}
  ${ProfileFieldList.fragments.field}
`;

const valueFragment = gql`
  fragment ProfileFieldsView_value on ProfileFieldValue {
    id
    ...ProfileFieldView_value
    ...ProfileFieldList_value
  }

  ${ProfileFieldView.fragments.value}
  ${ProfileFieldList.fragments.value}
`;

export default class ProfileFieldsView extends Component {
  static fragments = {
    field: fieldFragment,
    value: valueFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ).isRequired,

    values: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ),
  };

  renderItem = ({ field, value }) => {
    return (
      <ProfileFieldView
        key={field.id}
        field={field}
        value={value}
      />
    );
  }

  render() {
    const { style, fields, values } = this.props;

    return (
      <ProfileFieldList
        style={style}
        fields={fields}
        values={values}
        renderItem={this.renderItem}
      />
    );
  }
}
