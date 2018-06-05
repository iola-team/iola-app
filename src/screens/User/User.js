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

import { withStyleSheet as styleSheet } from 'theme';
import { UserHeading, UserBriefCard, UserFriendsCard, UserPhotosCard, PhotoPreview } from 'components';
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
})
export default class UserScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
  };

  render() {
    const { styleSheet, data: { user }, navigation: { navigate } } = this.props;

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
                  onChatPress={() => navigate(routes.CHANNEL, { userId: user.id })}
                />
                <View horizontalPadder>
                  <UserBriefCard user={user} />
                  <UserFriendsCard user={user} onItemPress={id => navigate(routes.USER, { id })} />
                  <PhotoPreview images={user.photos.edges.map(({ node }) => ({ url: node.url }))}>
                    {render => <UserPhotosCard user={user} onPress={index => render({ index })} />}
                  </PhotoPreview>
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
