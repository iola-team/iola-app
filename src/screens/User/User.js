import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Dimensions, PanResponder } from 'react-native';
import { Container, Content, View, Spinner, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import {
  UserHeading,
  UserBriefCard,
  UserFriendsCard,
  UserPhotosCard,
  UserPhotos,
} from 'components';
import * as routes from '../roteNames';

import TabBar from './TabBar';

const screenHeight = Dimensions.get("window").height;

const propsToVariables = props => ({
  id: props.navigation.state.params.id,
});

@graphql(gql`
  query UserDetailsQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
  ${UserBriefCard.fragments.user}
  ${UserFriendsCard.fragments.user}
  ${UserPhotosCard.fragments.user}
`, {
  options: props => ({
    variables: propsToVariables(props),
  }),
})
@styleSheet('Sparkle.UserScreen', {
  head: {
    marginTop: 55,
  },
})
export default class UserScreen extends Component {
  static navigationOptions = {
    headerTransparent: true,
  };

  render() {
    const {
      styleSheet, data: { user },
      navigation,
      children,
    } = this.props;

    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1 }}>
        {
          user ? (
            <Fragment>
              <View highlight style={{ marginBottom: 10 }}>
                <UserHeading
                  style={styleSheet.head}
                  user={user}
                  onBackPress={() => navigation.goBack()}
                  onChatPress={() => navigation.navigate(routes.CHANNEL, { userId: user.id })}
                />
              </View>

              <TabBar navigation={navigation}/>
            </Fragment>
          ) : (
            <Spinner />
          )
        }
        </Content>
      </Container>
    );
  }
}
