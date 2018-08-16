import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ProfileFieldList from '../ProfileFieldList';
import FieldView from '../FieldView';

const fieldFragment = gql`
  fragment ProfileFieldsView_field on ProfileField {
    id
    label
    ...ProfileFieldList_field
  }
  
  ${ProfileFieldList.fragments.field}
`;

export default class ProfileFieldsView extends Component {
  static fragments = {
    field: fieldFragment,
  }

  static propTypes = {
    fields: PropTypes.arrayOf(
      fragmentProp(fieldFragment).isRequired
    ).isRequired,
  };

  renderItem = (item) => {
    return (
      <FieldView
        key={item.id}
        label={item.label}
        type={'text'}
        value={'Text value'}
      />
    );
  }

  render() {
    const { style, fields } = this.props;

    return (
      <ProfileFieldList
        style={style}
        fields={fields}
        renderItem={this.renderItem}
      />
    );
  }
}
