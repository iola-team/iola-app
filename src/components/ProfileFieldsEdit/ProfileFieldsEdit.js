import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { noop } from 'lodash';
import { Toast } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { KeyboardAvoidingView } from '~components';
import ProfileFieldForm from '../ProfileFieldForm';

const userFragment = gql`
  fragment ProfileFieldsEdit_user on User {
    id
    profile {
      accountType {
        fields(on: EDIT) {
          id
          ...ProfileFieldForm_field
        }
      }
      values {
        id
        ...ProfileFieldForm_value
      }
    }
  }
  
  ${ProfileFieldForm.fragments.field}
  ${ProfileFieldForm.fragments.value}
`;

const saveMutation = gql`
  mutation saveProfileFieldValuesMutation($input: ProfileFieldSaveInput!) {
    saveProfileFieldValues(input: $input) {
      user {
        id
        name
        email
        info {
          about
          headline
          location
        }

        profile {
          values {
            id
            ...ProfileFieldForm_value
          }
        }
      }
    }
  }
  
  ${ProfileFieldForm.fragments.value}
`;

@graphql(saveMutation, {
  name: 'saveValuesMutation',
})
@styleSheet('Sparkle.ProfileFieldsEdit')
export default class ProfileFieldsEdit extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment),
    onFormReady: PropTypes.func,
    onSaveStart: PropTypes.func,
    onSaveEnd: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    onFormReady: noop,
    onSaveStart: noop,
    onSaveEnd: noop,
  }

  onSubmit = async (values) => {
    const {
      onSaveStart,
      onSaveEnd,
      saveValuesMutation,
      user: { id: userId },
    } = this.props;

    onSaveStart(values);

    try {
      const { data: { saveProfileFieldValues } } = await saveValuesMutation({
        variables: {
          input: {
            userId,
            values,
          },
        },
      });

      onSaveEnd(saveProfileFieldValues, null);
    } catch(error) {
      onSaveEnd(null, error);
    }
  }

  onSubmitError = (errors) => {
    Toast.show({
      text: 'Please, fill the form properly',
      duration: 5000,
      buttonText: 'OK',
      type: "danger",
    });
  };

  render() {
    const { user, onFormReady, ...props } = this.props;

    return (
      <KeyboardAvoidingView>
        <ProfileFieldForm
          {...props}
          fields={user?.profile.accountType.fields}
          values={user?.profile.values}
          onSubmit={this.onSubmit}
          onSubmitError={this.onSubmitError}
          onFormReady={onFormReady}
        />
      </KeyboardAvoidingView>
    );
  }
}
