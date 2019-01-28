import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { UserList } from 'components';

const searchBarValueQuery = gql`
  query searchBarValueQuery {
    searchBarValue @client
  }
`;

const usersQuery = gql`
  query usersQuery($search: String = "", $cursor: Cursor = null) {
    users(search: $search first: 20 after: $cursor) {
      edges {
        ...UserList_edge
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  
  ${UserList.fragments.edge}
`;

export default class DashboardFriends extends Component {
  static propTypes = {
    onItemPress: PropTypes.func.isRequired,
  };

  // @TODO: think about perfomance (shouldComponentUpdate)

  render() {
    const { onItemPress } = this.props;

    return (
      <Query query={searchBarValueQuery}>
        {({ data: { searchBarValue: search } }) => (
          <Query query={usersQuery} variables={{ search }} fetchPolicy="cache-and-network">
            {({ data }, loading, refetch) => (
              <UserList
                loading={loading}
                edges={data.users ? data.users.edges : []}
                onItemPress={onItemPress}
                onRefresh={refetch}
              />
            )}
          </Query>
        )}
      </Query>
    );
  }
}
