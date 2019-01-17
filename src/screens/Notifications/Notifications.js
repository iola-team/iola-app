import React, { Component } from 'react';
import { Container } from 'native-base';
// import gql from 'graphql-tag';
// import { graphql } from 'react-apollo';

import { Icon } from 'components';
// import * as routes from '../routeNames';

// @graphql(gql`
//   query {
//     me {
//       id
//       ...ChatList_user
//     }
//   }
//
//   ${ChatList.fragments.user}
// `)
export default class Notifications extends Component {
  static navigationOptions = {
    title: 'Notifications',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="notifications-bar" style={{ color: tintColor, fontSize: 20 }} />
    ),
  };

  // onItemPress = ({ node }) => {
  //   const { navigation: { navigate } } = this.props;
  //
  //   navigate(routes.CHANNEL, {
  //     chatId: node.id,
  //   });
  // };

  render() {
    // const { data: { me, loading } } = this.props;

    return (
      <Container>
        {/*{!loading && (*/}
          {/*<ChatList*/}
            {/*user={me}*/}
            {/*onItemPress={this.onItemPress}*/}
          {/*/>*/}
        {/*)}*/}
      </Container>
    );
  }
}
