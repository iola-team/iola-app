import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ImageBackground, Image } from 'react-native';
import {
  Container,
  Content,
  View,
  Text,
  Button,
  Icon,
  Spinner,
  Card,
  CardItem,
  Body,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { DashboardHeading, UserBriefCard, UserFriendsCard, UserPhotosCard } from 'components';
import * as routes from '../roteNames';

@graphql(gql`
  query DashboardQuery {
    user: me {
      id
      ...DashboardHeading_user
      ...UserBriefCard_user
      ...UserFriendsCard_user
      ...UserPhotosCard_user
    }
  }

  ${DashboardHeading.fragments.user}
  ${UserBriefCard.fragments.user}
  ${UserFriendsCard.fragments.user}
  ${UserPhotosCard.fragments.user}
`)
@styleSheet('Sparkle.DashboardScreen')
export default class Dashboard extends Component {
  static navigationOptions = {
    title: 'Dashboard',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor }}
        name={'ios-settings-outline'}
      />
    ),
    headerRight: (
      <Button transparent>
        <Text style={{ color: '#BDC0CB' }}>Logout</Text>
      </Button>
    ),
  };

  render() {
    const { styleSheet, data: { user }, navigation: { navigate } } = this.props;

    return (
      <Container>
        <Content>
          {
            user ? (
              <View>
                <DashboardHeading
                  style={styleSheet.head}
                  user={user}
                />
                <View horizontalPadder>
                  <UserBriefCard user={user} />
                  <UserFriendsCard user={user} onItemPress={id => navigate(routes.USER, { id })} />
                  <UserPhotosCard user={user} />
                </View>
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
