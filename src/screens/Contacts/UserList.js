import { debounce } from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from "react-native";
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import UserListItem from './UserListItem'

@graphql(gql`
  query allUsers($search: String = "", $cursor: Cursor) {
    users(search: $search first: 50 after: $cursor) {
      edges {
        node {
          id
          name
          activityTime
          avatar {
            id
            url
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)
export default class UserList extends PureComponent {
  static propTypes = {
    search: PropTypes.string,
  };

  static defaultProps = {
    search: "",
  };


  renderItem({ item }) {
    return (
      <UserListItem item={item} />
    );
  }

  refresh(vars = {}) {
    this.props.data.refetch(vars);
  }

  loadMore({ distanceFromEnd }) {
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

  extractItemKey({ node }) {
    return node.id;
  }

  render() {
    const { data: { users, networkStatus } } = this.props;
    const reFetching = networkStatus === NetworkStatus.refetch;

    return !users ? null : (
      <FlatList
        data={users.edges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
        onRefresh={::this.refresh}
        refreshing={reFetching}
        onEndReached={::this.loadMore}
      />
    );
  }
}
