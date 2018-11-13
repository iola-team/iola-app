import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { noop } from 'lodash';
import {
  Container,
  Content,
  View,
  Button,
  Spinner,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { AvatarEdit, PhotoEdit, ProfileFieldsEdit } from 'components';

@graphql(gql`
  query ProfileEditQuery {
    user: me {
      id

      ...AvatarEdit_user
      ...PhotoEdit_user
      ...ProfileFieldsEdit_user
    }
  }

  ${AvatarEdit.fragments.user}
  ${PhotoEdit.fragments.user}
  ${ProfileFieldsEdit.fragments.user}
`)
@styleSheet('Sparkle.ProfileEditScreen', {
  avatar: {
    paddingVertical: 30,
  }
})
export default class ProfileEditScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { done = noop, busy = false } = navigation.state.params || {};

    return  {
      title: 'Profile Edit',
      headerRight: (
        <Button transparent disabled={busy} onPress={done}>
          <Text>Done</Text>
        </Button>
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
      navigation.goBack();

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
      navigation.goBack();
    }
  };

  componentDidMount() {
    this.updateDone();
  }

  render() {
    const { styleSheet, data: { user }, navigation } = this.props;

    return (
      <Container>
        <Content>
          {
            user ? (
              <View>
                <AvatarEdit user={user} />
                <PhotoEdit user={user} />
                <ProfileFieldsEdit
                  user={user}
                  onFormReady={(form) => {
                    this.form = form;
                  }}

                  onSaveStart={this.onSaveStart}
                  onSaveEnd={this.onSaveEnd}
                />
              </View>
            ) : (
              <Spinner />
            )
          }
        </Content>
      </Container>
    );
  }
}
