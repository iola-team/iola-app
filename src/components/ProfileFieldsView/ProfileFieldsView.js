import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { View as ViewRN } from 'react-native';
import { Label, Body, Text } from 'native-base';

import ProfileFieldList from '../ProfileFieldList';
import { Item } from '../FieldList';

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
      <Item key={item.id}>
        <Label>{item.label}</Label>
        <Body>
          <Text>Body</Text>
        </Body>
      </Item>
    );
  }

  render() {
    const { style, fields } = this.props;

    return (
      <ViewRN style={style}>
        <ProfileFieldList
          fields={fields}
          renderItem={this.renderItem}
        />
      </ViewRN>
    );
  }
}
