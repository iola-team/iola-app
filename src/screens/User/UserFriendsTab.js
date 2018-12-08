import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { UserList } from 'components';

const userFriendsQuery = gql`
  query UserFriendsQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        friends {
          edges {
            ...UserList_edge
          }
        }
      }
    }
  }
  
  ${UserList.fragments.edge}
`;

@withNavigationFocus
export default class UserFriendsTab extends Component {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { navigation, isFocused } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userFriendsQuery} variables={{ id }}>
        {({ loading, networkStatus, data }) => (
          <UserList
            edges={loading || !isFocused ? [] : data.user.friends.edges}
            networkStatus={!isFocused ? 1 : networkStatus} 
          />
        )}
      </Query>
    );
  }
}
