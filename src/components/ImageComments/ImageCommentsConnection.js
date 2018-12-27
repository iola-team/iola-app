import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, subscribeToMore } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';
import { get, range } from 'lodash';

import ImageCommentsList from '../ImageCommentsList';

const photoCommentsQuery = gql`
  query PhotoCommentsQuery($id: ID!, $cursor: Cursor = null) {
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

const photoCommentsSubscriptionAdd = gql`
  subscription PhotoCommentAddSubscription($photoId: String!) {
    onPhotoCommentAdd(photoId: $photoId) {
      node {
        id
        text
        createdAt
      }
    }
  }
`;

export default class ImageCommentsConnection extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    onItemPress: PropTypes.func,
    photoCommentsQuery: graphqlPropType(photoCommentsQuery),
    imageCommentsListForwardedRef: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static queries = {
    photoCommentsQuery,
  };

  handleLoadMore({ photo: { comments: { pageInfo } } }, fetchMore) {
    if (!pageInfo.hasNextPage) return;

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
    const { photoId, onItemPress, imageCommentsListForwardedRef } = this.props;

    return (
      <Query query={photoCommentsQuery} variables={{ id: photoId }}>
        {({ loading, data, fetchMore, networkStatus, subscribeToMore }) => {
          const refreshing = networkStatus === NetworkStatus.refetch;
          const edges = get(data, 'photo.comments.edges', []);

          return (
            <ImageCommentsList
              photoId={photoId}
              onItemPress={onItemPress}
              loading={loading}
              refreshing={refreshing}
              edges={edges}
              onRefresh={data.refetch}
              imageCommentsListForwardedRef={imageCommentsListForwardedRef}
              onEndReached={() => loading ? null : this.handleLoadMore(data, fetchMore)}
              onEndReachedThreshold={2}
              inverted={!!edges}
              subscribeToNewComments={() => subscribeToMore({
                document: photoCommentsSubscriptionAdd,
                variables: { photoId },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
console.log('subscriptionData', prev, subscriptionData);
return prev;
                }
              })}
              inverted={!!edges.length}
            />
          );
        }}
      </Query>
    );
  }
}
