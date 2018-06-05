import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { noop } from 'lodash';
import {
  Container,
  Content,
  View,
  Spinner,
  Button,
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
    const { done = noop } = navigation.state.params || {};

    return  {
      title: 'Profile Edit',
      headerRight: (
        <Button transparent onPress={done}>
          <Text>Done</Text>
        </Button>
      ),
    };
  };

  done = form => () => {
    form.submit();
  };

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
                    navigation.setParams({
                      done: this.done(form),
                    });
                  }}
                />
              </View>
            ) : (
              <Spinner/>
            )
          }
        </Content>
      </Container>
    );
  }
}
