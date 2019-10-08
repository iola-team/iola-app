import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container } from 'native-base';

import { UserList } from '~components';
import { USER } from '../routeNames';

@graphql(gql`
  query BlockedUsersQuery {
    me {
      id
      blockedUsers {
        edges {
          ...UserList_edge
        }
      }
    }
  }

  ${UserList.fragments.edge}
`)
export default class BlockedUsers extends Component {
  static navigationOptions = {
    title: 'Blocked users',
  };

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate({ routeName: USER, params: { id }, key: id });
  };

  render() {
    const { screenProps, styleSheet: styles, data: { me, loading } } = this.props;

    return (
      <Container>
        <UserList
          loading={loading}
          edges={me?.blockedUsers.edges}
          onItemPress={this.onItemPress}
          contentInset={{ ...screenProps.contentInset, bottom: 0 }}
        />
      </Container>
    );
  }
}
