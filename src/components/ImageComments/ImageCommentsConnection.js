import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ImageCommentsList from '../ImageCommentsList';

const propsToVariables = props => ({
  id: props.photoId,
});

@graphql(gql`
  query imageCommentsQuery($id: ID!, $cursor: Cursor = null) {
    photo: node(id: $id) {
      ...on Photo {
        id
        comments(first: 10 after: $cursor) {
          edges {
            ...ImageCommentsList_edge
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }

  ${ImageCommentsList.fragments.edge}
`, {
  options: props => ({
    variables: propsToVariables(props),
  }),
})
export default class ImageCommentsConnection extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  refresh(vars = {}) {
    this.props.data.refetch(vars);
  }

  handleLoadMore({ distanceFromEnd }) {
    const { fetchMore, photo: { comments: { pageInfo } } } = this.props.data;

    if (!pageInfo.hasNextPage) {
      return;
    }

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },

      updateQuery: (prev, { fetchMoreResult: { photo } }) => {
        const { comments } = photo;

        if (!comments || !comments.edges.length) {
          return prev;
        }

        return {
          photo: {
            ...prev.photo,
            comments: {
              ...prev.photo.comments,
              edges: [
                ...prev.photo.comments.edges,
                ...comments.edges
              ],
              pageInfo: {
                ...prev.photo.comments.pageInfo,
                ...comments.pageInfo
              },
            },
          },
        };
      }
    }).then(() => {
      this.fetchMorePromise = null;
    });
  }

  render() {
    if (this.props.data.loading) return null; // @TODO: add spinner

    const {
      data: {
        photo: { comments },
        networkStatus,
      },
      photoId,
      height,
      onItemPress,
    } = this.props;
    const reFetching = networkStatus === NetworkStatus.refetch;

    return !comments ? null : (
      <ImageCommentsList
        photoId={photoId}
        height={height}
        onItemPress={onItemPress}
        edges={comments.edges}
        onRefresh={::this.refresh}
        refreshing={reFetching}
        onEndReached={::this.handleLoadMore}
      />
    );
  }
}
