import React, { Component } from 'react';
import gql from 'graphql-tag';

import { SearchBar, SearchResult, UserList } from 'components';
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

  renderBlank = () => null;
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