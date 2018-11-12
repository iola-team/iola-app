import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import ProfileFieldList from '../ProfileFieldList';
import ProfileFieldView from '../ProfileFieldView';

const userFragment = gql`
  fragment ProfileFieldsView_user on User {
    id
    profile {
      accountType {
        fields(on: VIEW) {
          id
          ...ProfileFieldView_field
          ...ProfileFieldList_field
        }
      }
      values {
        id
        ...ProfileFieldView_value
        ...ProfileFieldList_value
      }
    }
  }

  ${ProfileFieldView.fragments.field}
  ${ProfileFieldView.fragments.value}
  ${ProfileFieldList.fragments.value}
  ${ProfileFieldList.fragments.field}
`;

export default class ProfileFieldsView extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  renderItem = ({ field, ...props }) => (
    <ProfileFieldView {...props} key={field.id} field={field} />
  );

  render() {
    const { style, user: { profile } } = this.props;

    return (
      <ProfileFieldList
        style={style}
        fields={profile.accountType.fields}
        values={profile.values}
        renderItem={this.renderItem}
      />
    );
  }
}
