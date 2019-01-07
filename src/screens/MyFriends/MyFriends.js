import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { FriendList } from 'components';

const userFriendsQuery = gql`
  query MyFriendsQuery {
    user: me {
      id
      friends(filter: {
        friendshipStatusIn: [ACTIVE, PENDING]
      }) {
        edges {
          ...FriendList_edge
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

@withStyleSheet('Sparkle.MyFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
@withNavigationFocus
export default class MyFriends extends PureComponent {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { isFocused, styleSheet: styles } = this.props;

    return (
      <Query skip={!isFocused} query={userFriendsQuery}>
        {({ loading, data }) => (
          <FriendList
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
