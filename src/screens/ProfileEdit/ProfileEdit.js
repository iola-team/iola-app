import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { noop } from 'lodash';
import { Container, Text } from 'native-base';

import { withStyleSheet } from '~theme';
import { ProfileFieldsEdit, TouchableOpacity, AvatarEdit } from '~components';

@graphql(gql`
  query ProfileEditQuery {
    me {
      id
      ...ProfileFieldsEdit_user
      ...AvatarEdit_user
    }
  }

  ${ProfileFieldsEdit.fragments.user}
  ${AvatarEdit.fragments.user}
`)
@withStyleSheet('Sparkle.ProfileEditScreen', {
  avatar: {
    marginTop: 15,
    marginBottom: 10,
  }
})
export default class ProfileEditScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { done = noop, busy = false } = navigation.state.params || {};

    return  {
      title: 'Profile Edit',
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
    const { data: { loading, me }, styleSheet: styles } = this.props;

    return (
      <Container>
        <ProfileFieldsEdit
          loading={loading}
          user={me}
          onFormReady={(form) => {
            this.form = form;
          }}

          onSaveStart={this.onSaveStart}
          onSaveEnd={this.onSaveEnd}

          ListHeaderComponent={<AvatarEdit style={styles.avatar} user={me} loading={loading} />}
          contentInset={{ bottom: 0 }}
        />
      </Container>
    );
  }
}
