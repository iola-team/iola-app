import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { withStyleSheet } from '~theme';
import { SearchBar, SearchResult, UserList, UsersRow, SearchBlank } from '~components';
import { USER } from '../routeNames';

const searchQuery = gql`
  query UserSearchQuery($search: String = "", $first: Int = 10, $after: Cursor) {
    users(filter: { search: $search }, first: $first, after: $after) {
      ...SearchResult_connection

      edges {
        node {
          id
          name
        }

        ...UserList_edge
      }
    }
  }

  ${UserList.fragments.edge}
  ${SearchResult.fragments.connection}
`;

const onlineUsersQuery = gql`
  query UserSearchOnlineQuery {
    users(filter: { online: true }, first: 100) {
      edges {
        ...UsersRow_edge
      }
    }
  }

  ${UsersRow.fragments.edge}
`;

const recentUsersQuery = gql`
  query UserSearchRecentQuery($ids: [ID!]) {
    users(filter: { ids: $ids }) {
      edges {
        ...UserList_edge
      }
    }
  }

  ${UserList.fragments.edge}
`;

@withStyleSheet('Sparkle.UserSearchScreen')
export default class UserSearch extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        autoFocus
        placeholder="Search users"
        searching={navigation.getParam('searching', false)}
        value={navigation.getParam('search', '')}
        onChangeText={search => navigation.setParams({ search })}
      />
    ),
    headerStyle: {
      borderBottomWidth: 0,
    },
    headerTitleContainerStyle: {
      right: 16, // TODO: Move this value to theme somehow
    },
  });

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate(USER, { id });
  };

  renderList = (props) => (
    <UserList
      {...props}
      noContentText="No users found"

      initialNumToRender={6}
      windowSize={1}
    />
  );

  renderBlank = ({ onItemPress, recentIds }) => {
    const { styleSheet: styles } = this.props;

    return (
      <Query query={onlineUsersQuery}>
        {({ data: { users: onlineUsers }, loading: loadingOnline }) => (
          <Query query={recentUsersQuery} variables={{ ids: recentIds }} skip={!recentIds.length}>
            {({ data: recentData, loading: loadingRecent }) => (

              <SearchBlank
                edges={recentData?.users?.edges || []}
                loading={loadingRecent}

                hasRecentItems={!!recentIds.length}
                headerTitle="Online"
                contentTitle="Recent"
                noContentText="No recent users"
                onItemPress={onItemPress}
                ListComponent={UserList}
                headerList={(
                  <UsersRow
                    style={styles.usersRow}
                    loading={loadingOnline}
                    edges={onlineUsers?.edges || []} // TODO: Figure out UsersRow empty state
                    onItemPress={onItemPress}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              />

            )}
          </Query>
        )}
      </Query>
    );
  };

  filterEdges = (edge, search) => edge.node.name.toLowerCase().indexOf(search.toLowerCase()) === 0;

  onSearchingStateChange = (searching) => {
    const { navigation } = this.props;

    navigation.setParams({ searching });
  };

  render() {
    const { navigation } = this.props;

    return (
      <SearchResult
        search={navigation.getParam('search', '')}
        query={searchQuery}
        historyKey="users"
        connectionPath="users"
        onItemPress={this.onItemPress}
        filterEdges={this.filterEdges}
        renderBlank={this.renderBlank}
        onSearchingStateChange={this.onSearchingStateChange}
      >
        {this.renderList}
      </SearchResult>
    );
  }
}