import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
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

@withStyleSheet('Sparkle.UserFriendsScreen', {
  list: {
    paddingTop: 8,
  }
})
@withNavigationFocus
export default class UserFriends extends PureComponent {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { navigation, isFocused, styleSheet: styles } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userFriendsQuery} variables={{ id }}>
        {({ loading, networkStatus, data }) => (
          <UserList
            contentContainerStyle={styles.list}
            edges={loading || !isFocused ? [] : data.user.friends.edges}
            networkStatus={!isFocused ? 1 : networkStatus} 
          />
        )}
      </Query>
    );
  }
}
