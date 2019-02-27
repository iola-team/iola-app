import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Text, View } from 'native-base';

import { withStyleSheet } from 'theme';
import { SearchBar, SearchResult, UserList, UsersRow, SearchBlank } from 'components';
import { USER } from '../routeNames';

const searchQuery = gql`
  query UserSearchQuery($search: String = "", $first: Int = 10, $after: Cursor) @connection(key: "UsersConnection_search") {
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

const suggestionsQuery = gql`
  query UserSearchSuggestionsQuery($first: Int = 50, $after: Cursor = null) {
    users(first: $first, after: $after) @connection(key: "UsersConnection_suggestions") {
      edges {
        ...UsersRow_edge
        ...UserList_edge
      }
    }
  }

  ${UserList.fragments.edge}
  ${UsersRow.fragments.edge}
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
      onItemPress={this.onItemPress}

      initialNumToRender={6}
      windowSize={1}
    />
  );

  renderBlank = () => {
    const { styleSheet: styles } = this.props;

    return (
      <Query query={suggestionsQuery}>
        {({ data, loading }) => (
          <SearchBlank
            edges={data.users?.edges || []}

            headerTitle="Online"
            contentTitle="Recent"
            isEmpty={!data.users?.edges.length}
            ListComponent={UserList}
            headerList={(
              <UsersRow
                style={styles.usersRow}
                loading={loading}
                edges={data.users?.edges || []}
                showsHorizontalScrollIndicator={false}
              />
            )}
          />
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
    const search = navigation.getParam('search', '');

    return (
      <SearchResult
        search={search}
        query={searchQuery}
        filterEdges={this.filterEdges}
        connectionPath="users"
        renderBlank={this.renderBlank}
        onSearchingStateChange={this.onSearchingStateChange}
      >
        {this.renderList}
      </SearchResult>
    );
  }
}