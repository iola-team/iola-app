import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';

import { UserList } from '~components';

@graphql(gql`
  query users($first: Int $cursor: Cursor) {
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
`, {
  options: {
    variables: {
      first: 30,
    },
  },
})
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

    if (loading || !users.pageInfo.hasNextPage) {
      return;
    }

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        first: 50,
        cursor: users.pageInfo.endCursor,
      },

      updateQuery: (prev, { fetchMoreResult }) => update(prev, {
        users: {
          edges: {
            $push: fetchMoreResult.users.edges,
          },
          pageInfo: {
            $set: fetchMoreResult.users.pageInfo,
          },
        },
      }),

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
        edges={users?.edges}
        onItemPress={onItemPress}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}

        onEndReachedThreshold={2} // Two screens
      />
    );
  }
}
