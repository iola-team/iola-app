import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { noop } from 'lodash';
import { Button, Text } from 'native-base';

import { withStyleSheet } from 'theme';
import { ProfileFieldsEdit, TouchableOpacity } from 'components';

@graphql(gql`
  query ProfileEditQuery {
    me {
      id
      ...ProfileFieldsEdit_user
    }
  }

  ${ProfileFieldsEdit.fragments.user}
`)
@withStyleSheet('Sparkle.ProfileEditInfoScreen', {
  avatar: {
    paddingVertical: 30,
  }
})
export default class ProfileEditInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { done = noop, busy = false } = navigation.state.params || {};

    return  {
      title: 'Info',
      headerRight: (
        <TouchableOpacity disabled={busy} onPress={done}>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
    };
  };

  form = null;

  updateDone(busy = false) {
    const { navigation } = this.props;

    navigation.setParams({
      done: this.onDone,
      busy,
    });
  }

  onDone = () => {
    const { navigation } = this.props;

    if (!this.form || !this.form.isDirty) {
      navigation.goBack(null);

      return;
    }

    this.form.submit();
  };

  onFormReady = (form) => {
    this.form = form;
  };

  onSaveStart = () => {
    this.updateDone(true);
  };

  onSaveEnd = (data, error) => {
    const { navigation } = this.props;

    this.updateDone(false);

    if (!error) {
      navigation.goBack(null);
    }
  };

  componentDidMount() {
    this.updateDone();
  }

  render() {
    const { data: { loading, me } } = this.props;

    return (
      <ProfileFieldsEdit
        loading={loading}
        user={me}
        onFormReady={(form) => {
          this.form = form;
        }}

        onSaveStart={this.onSaveStart}
        onSaveEnd={this.onSaveEnd}
      />
    );
  }
}
