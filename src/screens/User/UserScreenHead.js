import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ScrollView } from 'react-native';
import { View, Spinner, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { UserHeading } from 'components';
import * as routes from '../roteNames';
import TabBar from './TabBar';

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
`, {
  options: props => ({
    variables: propsToVariables(props),
  }),
})
@styleSheet('Sparkle.UserScreenHead', {
  head: {
    marginTop: 55,
  },
})
export default class UserScreenHead extends Component {

  render() {
    const {
      style,
      styleSheet, data: { user },
      navigation,
    } = this.props;

    return user ? (
      <View style={style}>
        <View highlight style={{ marginBottom: 10 }}>
          <UserHeading
            style={styleSheet.head}
            user={user}
            onBackPress={() => navigation.goBack()}
            onChatPress={() => navigation.navigate(routes.CHANNEL, { userId: user.id })}
          />
        </View>

        <TabBar navigation={navigation}/>
      </View>
    ) : (
      <Spinner />
    );
  }
}
