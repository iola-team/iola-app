import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { UserList, FriendsTabBarLabel } from 'components';
import TabBarLabel from './TabBarLabel';

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

        ...FriendsTabBarLabel_user
      }
    }
  }
  
  ${FriendsTabBarLabel.fragments.user}
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
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <TabBarLabel userId={navigation.state.params.id} />,
  });

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { data: { user, loading }, styleSheet: styles } = this.props;
    const edges = user?.friends.edges || [];

    return (
      <UserList
        contentContainerStyle={styles.list}
        edges={edges}
        loading={loading}
        noContentText="No friends"
      />
    );
  }
}
