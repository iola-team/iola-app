import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Container,
  Content,
  View,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { AvatarToolbar } from 'components';
import { DashboardHeading, UserBriefCard, UserFriendsCard, UserPhotosCard } from '../../components'

@graphql(gql`
  query ProfileEditQuery {
    user: me {
      id

      ...AvatarToolbar_user
    }
  }

  ${AvatarToolbar.fragments.user}
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
          <View
            highlight
            horizontalPadder
            style={styleSheet.avatar}
          >
            <AvatarToolbar user={user} />
          </View>
        </Content>
      </Container>
    );
  }
}
