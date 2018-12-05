import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';

import ImageCommentsList from '../ImageCommentsList';

const photoCommentsQuery = gql`
  query photoCommentsQuery($id: ID!, $cursor: Cursor = null) {
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
`;

export default class ImageCommentsConnection extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    onItemPress: PropTypes.func,
    photoCommentsQuery: graphqlPropType(photoCommentsQuery),
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static queries = {
    photoCommentsQuery,
  };

  refresh(vars = {}) {
    this.props.data.refetch(vars);
  }

  handleLoadMore({ fetchMore, photo: { comments: { pageInfo } } }) {
    if (!pageInfo.hasNextPage) {
      return;
    }

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },

      updateQuery: (previousResult, { fetchMoreResult: { photo } }) => {
        const { comments } = photo;

        if (!comments || !comments.edges.length) {
          return previousResult;
        }

        return {
          photo: {
            ...previousResult.photo,
            comments: {
              ...previousResult.photo.comments,
              edges: [
                ...previousResult.photo.comments.edges,
                ...comments.edges
              ],
              pageInfo: {
                ...previousResult.photo.comments.pageInfo,
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
    const { photoId, height, onItemPress } = this.props;

    return (
      <Query query={photoCommentsQuery} variables={{ id: photoId }}>
        {({ data, loading }) => {
          if (loading) return null;

          const { photo: { comments }, networkStatus } = data;
          const reFetching = networkStatus === NetworkStatus.refetch;

          return comments ? (
            <ImageCommentsList
              photoId={photoId}
              height={height}
              onItemPress={onItemPress}
              edges={comments.edges}
              onRefresh={::this.refresh}
              refreshing={reFetching}
              onEndReached={({ distanceFromEnd }) => this.handleLoadMore(data)}
            />
          ) : null;
        }}
      </Query>
    );
  }
}
