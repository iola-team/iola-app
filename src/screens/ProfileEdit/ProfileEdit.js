import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { noop } from 'lodash';
import { Container, Text } from 'native-base';

import { withStyleSheet } from '~theme';
import { ProfileFieldsEdit, TouchableOpacity, AvatarEdit } from '~components';

@graphql(gql`
  query ProfileEditFieldsQuery {
    me {
      id
      ...ProfileFieldsEdit_user
    }
  }

  ${ProfileFieldsEdit.fragments.user}
`, {
  name: 'fieldsData',
})
@graphql(gql`
  query ProfileEditAvatarQuery {
    me {
      id
      ...AvatarEdit_user
    }
  }

  ${AvatarEdit.fragments.user}
`, {
  name: 'avatarData',
})
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
    const { fieldsData, avatarData, styleSheet: styles, screenProps } = this.props;

    return (
      <Container>
        <ProfileFieldsEdit
          loading={fieldsData.loading}
          user={fieldsData.me}
          onFormReady={(form) => {
            this.form = form;
          }}

          onSaveStart={this.onSaveStart}
          onSaveEnd={this.onSaveEnd}

          ListHeaderComponent={(
            <AvatarEdit style={styles.avatar} user={avatarData.me} loading={avatarData.loading} />
          )}
          contentInset={{ ...screenProps.contentInset, bottom: 0 }}
        />
      </Container>
    );
  }
}
