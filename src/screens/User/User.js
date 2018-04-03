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

const propsToVariables = props => ({
  id: props.navigation.state.params.id,
});

@graphql(gql`
  query UserDetailsQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...Head_user
      ...on User {
        info {
          location
          about
        }
      }
    }
  }

  ${Head.fragments.user}
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
                  <Card transparent>
                    <CardItem header>
                      <Icon name={"ios-pricetag-outline"} />
                      <Text>{user.info.location}</Text>
                    </CardItem>
                    <CardItem>
                      <Text>{user.info.about}</Text>
                    </CardItem>
                  </Card>

                  <Card transparent topBorder>
                    <CardItem header>
                      <Text>Friends 12</Text>
                    </CardItem>
                    <CardItem>
                      <Text>Friend list here...</Text>
                    </CardItem>
                  </Card>

                  <Card transparent topBorder>
                    <CardItem header>
                      <Text>Photos 12</Text>
                    </CardItem>
                    <CardItem>
                      <Text>Photo list here...</Text>
                    </CardItem>
                  </Card>
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
