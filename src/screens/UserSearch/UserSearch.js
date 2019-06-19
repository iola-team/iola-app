import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Container, Text } from 'native-base';

import { withStyleSheet } from '~theme';
import { USER } from '../routeNames';
import {
  SearchBar,
  SearchResult,
  UserList,
  SearchBlank,
  TouchableOpacity,
} from '~components';

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

const recentUsersQuery = gql`
  query UserSearchRecentQuery($ids: [ID!]) {
    users(filter: { ids: $ids }) @connection(key: "UserSearchRecentUsersConnection") {
      edges {
        ...UserList_edge
      }
    }
  }

  ${UserList.fragments.edge}
`;

@withStyleSheet('Sparkle.UserSearchScreen', {
  'NativeBase.Container': {
    backgroundColor: '#FFFFFF',
  },
})
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
    headerTitleContainerStyle: {
      left: 16, // TODO: Move this value to theme somehow
      right: 70,
    },
    headerLeft: null,
    headerRight: (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Close</Text>
      </TouchableOpacity>
    ),
  });

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate({ routeName: USER, params: { id }, key: id });
  };

  renderList = (props) => {
    const { screenProps } = this.props;

    return (
      <UserList
        {...props}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={null} // Disable `no items`
        contentInset={{ ...screenProps.contentInset, bottom: 0 }}

        initialNumToRender={6}
      />
    );
  };

  renderBlank = ({ onItemPress, recentIds }) => {
    const { screenProps } = this.props;
    const recentEdgeSorter = (a, b) => recentIds.indexOf(a.node.id) - recentIds.indexOf(b.node.id);

    return (
      <Query query={recentUsersQuery} variables={{ ids: recentIds }} skip={!recentIds.length}>
        {({ data: recentData, loading: loadingRecent }) => (

          <SearchBlank
            /**
             * TODO: Memo the sort result
             */
            edges={recentData?.users?.edges.sort(recentEdgeSorter)}

            loading={loadingRecent}
            hasContent={!!recentIds.length}
            contentTitle="Recent"
            ListEmptyComponent={null} // Disable `no items`
            onItemPress={onItemPress}
            keyboardShouldPersistTaps="handled"
            ListComponent={UserList}
            contentInset={{ ...screenProps.contentInset, bottom: 0 }}
            searchResult
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

    return (
      <Container>
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
      </Container>
    );
  }
}