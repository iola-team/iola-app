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
import Head from './Head';
import AboutCard from './AboutCard';
import FriendsCard from './FriendsCard';
import PhotosCard from './PhotosCard';

const propsToVariables = props => ({
  id: props.navigation.state.params.id,
});

@graphql(gql`
  query UserDetailsQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...Head_user
      ...AboutCard_user
      ...FriendsCard_user
      ...PhotosCard_user
    }
  }

  ${Head.fragments.user}
  ${AboutCard.fragments.user}
  ${FriendsCard.fragments.user}
  ${PhotosCard.fragments.user}
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
    header: null,
  };

  render() {
    const { styleSheet, data: { user }, navigation: { goBack } } = this.props;

    return (
      <Container>
        <Content>
          {
            user ? (
              <View>
                <Head
                  style={styleSheet.head}
                  user={user}
                  onBackPress={() => goBack()}
                />
                <View horizontalPadder>
                  <AboutCard user={user} />
                  <FriendsCard user={user} />
                  <PhotosCard user={user} />
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
