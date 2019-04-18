import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';

import { UserList } from '~components';

@graphql(gql`
  query users($first: Int = 20, $cursor: Cursor = null) {
    users(first: $first after: $cursor) {
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
    search: '',
    onItemPress: () => {},
  };

  state = {
    isRefreshing: false,
  };

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

  loadMore = ({ distanceFromEnd }) => {
    const { loading, fetchMore, users } = this.props.data;

    if (loading) return;

    const { pageInfo } = users;

    if (!pageInfo.hasNextPage) return;

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },

      updateQuery: (prev, { fetchMoreResult: { users } }) => {
        if (!users || !users.edges.length) {
          return prev;
        }

        return update(prev, {
          users: {
            edges: {
              $push: users.edges,
            },
            pageInfo: {
              $merge: pageInfo,
            },
          },
        });
      }
    }).then(() => {
      this.fetchMorePromise = null;
    });
  };

  render() {
    const { data: { users, loading }, onItemPress, ...listProps } = this.props;
    const { isRefreshing } = this.state;

    return (
      <UserList
        {...listProps}

        loading={loading}
        hasMore={users?.pageInfo.hasNextPage}
        refreshing={isRefreshing}
        edges={users?.edges || []}
        onItemPress={onItemPress}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
      />
    );
  }
}
