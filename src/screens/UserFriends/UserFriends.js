import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserList } from '~components';

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
  },
})
@graphql(userFriendsQuery, {
  options: props => ({
    variables: {
      id: props.navigation.state.params.id,
    },
  }),
})
@withNavigationFocus
export default class UserFriends extends Component {
  static navigationOptions = {
    tabBarLabel: 'Friends',
  };

  state = {
    isRefreshing: false,
  };

  /**
   * TODO: Move these common logic to a central place, to prevent copy & past
   */
  refresh = async () => {
    const { data: { refetch } } = this.props;
    
    this.setState({ isRefreshing: true });
    try {
      await refetch({ cursor: null });
    } catch {
      // Pass...
    }
    this.setState({ isRefreshing: false });
  };

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { data: { user, loading }, styleSheet: styles } = this.props;
    const { isRefreshing } = this.state;
    const edges = user?.friends.edges || [];

    return (
      <Container>
        <UserList
          contentContainerStyle={styles.list}
          edges={edges}
          loading={loading}
          noContentText="No friends"
          refreshing={isRefreshing}
          onRefresh={this.refresh}
        />
      </Container>
    );
  }
}
