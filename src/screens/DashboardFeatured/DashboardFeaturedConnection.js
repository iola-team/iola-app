import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';

import { UserList } from '~components';

@graphql(gql`
  query users($cursor: Cursor = null) {
    users(filter: { featured: true } first: 20 after: $cursor) {
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
export default class DashboardFeatured extends Component {
  static propTypes = {
    search: PropTypes.string,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    search: '',
    onItemPress: () => {},
  };

  shouldComponentUpdate({ data }) {
    const { users, networkStatus } = data;
    const prev = this.props.data;

    return prev.users !== users || prev.networkStatus !== networkStatus;
  }

  refresh = (vars = {}) => this.props.data.refetch(vars);

  loadMore = ({ distanceFromEnd }) => {
    const { loading, fetchMore, users } = this.props.data;

    if (loading) return;

    const { pageInfo } = users;

    if (!pageInfo.hasNextPage) return;

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: users.pageInfo.endCursor,
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
              $merge: users.pageInfo,
            },
          },
        });
      }
    }).then(() => {
      this.fetchMorePromise = null;
    });
  };

  render() {
    const { data: { users, loading }, onItemPress } = this.props;

    return (
      <UserList
        loading={loading}
        edges={users?.edges}
        onItemPress={onItemPress}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
      />
    );
  }
}
