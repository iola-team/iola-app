import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
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
@withNavigationFocus
export default class UserFriends extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <TabBarLabel userId={navigation.state.params.id} />,
  });

  render() {
    const { navigation, isFocused, styleSheet: styles } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userFriendsQuery} variables={{ id }}>
        {({ loading, data }) => (
          <UserList
            contentContainerStyle={styles.list}
            edges={loading || !isFocused ? [] : data.user.friends.edges}
            loading={loading || !isFocused}
            noContentText="No friends"
          />
        )}
      </Query>
    );
  }
}
