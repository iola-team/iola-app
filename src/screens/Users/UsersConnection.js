import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { UserList } from 'components';

@graphql(gql`
  query allUsers($search: String = "", $cursor: Cursor = null) {
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
`)
export default class UsersConnection extends Component {
  static propTypes = {
    search: PropTypes.string,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    search: "",
    onItemPress: () => {},
  };

  shouldComponentUpdate({ data }) {
    const { users, networkStatus } = data;
    const prev = this.props.data;

    return prev.users !== users || prev.networkStatus !== networkStatus;
  }

  refresh = (vars = {}) => {
    this.props.data.refetch(vars);
  }

  loadMore = ({ distanceFromEnd }) => {
    const { fetchMore, users: { pageInfo } } = this.props.data;

    if (!pageInfo.hasNextPage) {
      return;
    }

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult: { users } }) => {
        if (!users || !users.edges.length) {
          return prev;
        }

        return {
          users: {
            ...prev.users,
            edges: [
              ...prev.users.edges,
              ...users.edges
            ],
            pageInfo: {
              ...prev.users.pageInfo,
              ...users.pageInfo,
            }
          },
        };
      }
    }).then(() => {
      this.fetchMorePromise = null;
    });
  }

  render() {
    const { data: { users, networkStatus }, onItemPress } = this.props;

    return (
      <UserList
        networkStatus={networkStatus}
        edges={users ? users.edges : []}
        onItemPress={onItemPress}
        onRefresh={this.refresh}
        // refreshing={networkStatus === NetworkStatus.refetch}
        // onEndReached={this.loadMore}
      />
    );
  }
}
