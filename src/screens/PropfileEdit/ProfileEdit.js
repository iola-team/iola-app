import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Container,
  Content,
  View,
  Spinner,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { AvatarEdit, PhotoEdit } from 'components';

@graphql(gql`
  query ProfileEditQuery {
    user: me {
      id

      ...AvatarEdit_user
      ...PhotoEdit_user
    }
  }

  ${AvatarEdit.fragments.user}
  ${PhotoEdit.fragments.user}
`)
@styleSheet('Sparkle.ProfileEditScreen', {
  avatar: {
    paddingVertical: 30,
  }
})
export default class ProfileEditScreen extends Component {
  static navigationOptions = {
    title: 'Profile Edit',
  };

  render() {
    const { styleSheet, data: { user } } = this.props;

    return (
      <Container>
        <Content>
          {
            user ? (
              <View>
                <AvatarEdit user={user} />
                <PhotoEdit user={user} />
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
