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
import { UserHeading, UserBriefCard, UserFriendsCard, UserPhotosCard } from 'components';
import * as routes from '../roteNames';

const propsToVariables = props => ({
  id: props.navigation.state.params.id,
});

@graphql(gql`
  query UserDetailsQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...UserHeading_user
      ...UserBriefCard_user
      ...UserFriendsCard_user
      ...UserPhotosCard_user
    }
  }

  ${UserHeading.fragments.user}
  ${UserBriefCard.fragments.user}
  ${UserFriendsCard.fragments.user}
  ${UserPhotosCard.fragments.user}
`, {
  options: (props) => ({
    variables: propsToVariables(props),
  }),
})
@styleSheet('Sparkle.UserScreen', {
  head: {
    height: 350,
  },

  backIcon: {
    fontSize: 35,
    color: '#BDC0CB',
  },
})
export default class UserScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
  };

  render() {
    const { styleSheet, data: { user }, navigation: { goBack, navigate } } = this.props;

    return (
      <Container>
        <Content>
          {
            user ? (
              <View>
                <UserHeading
                  style={styleSheet.head}
                  user={user}
                  onBackPress={() => goBack()}
                  onChatPress={() => navigate(routes.CHANNEL, {
                    userId: user.id,
                  })}
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
