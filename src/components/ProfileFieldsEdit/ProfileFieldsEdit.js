import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Toast,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';
import FieldForm from '../FieldForm';
import Field from '../FieldForm/Field'

const userFragment = gql`
  fragment ProfileFieldsEdit_user on User {
    id
    
    profile {
      accountType {
        fields(on: EDIT) {
          id
          ...FieldForm_field
        }
      }
      values {
        id
        ...FieldForm_value
      }
    }
  }
  
  ${FieldForm.fragments.field}
  ${FieldForm.fragments.value}
`;

@styleSheet('Sparkle.ProfileFieldsEdit', {
  root: {

  }
})
export default class ProfileFieldsEdit extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    onFormReady: PropTypes.func,
  };

  onSubmit = (values) => {
    alert(JSON.stringify(values));
  }

  onSubmitError = (errors) => {
    Toast.show({
      text: 'Please, fill the form properly',
      duration: 5000,
      buttonText: 'Ok',
      type: "danger",
    });
  };

  render() {
    const { style, user: { profile }, styleSheet, onFormReady } = this.props;

    return (
      <View style={[styleSheet.root, style]}>
        <FieldForm
          fields={profile.accountType.fields}
          values={profile.values}
          onSubmit={this.onSubmit}
          onSubmitError={this.onSubmitError}
          onFormReady={onFormReady}
        />
      </View>
    );
  }
}
