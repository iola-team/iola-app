import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, subscribeToMore } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';
import { get, range } from 'lodash';
import update from 'immutability-helper';

import ImageCommentsList from '../ImageCommentsList';

const meQuery = gql`
  query meQuery {
    user: me {
      id
    }
  }
`;

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

const photoCommentAddSubscription = gql`
  subscription PhotoCommentAddSubscription($photoId: ID!) {
    onPhotoCommentAdd(photoId: $photoId) {
      ...on PhotoCommentCreatePayload {
        node {
          id
          text
          createdAt
        }

        edge {
          ...ImageCommentsList_edge
        }
      }
    }
  }

  ${ImageCommentsList.fragments.edge}
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
      <Query query={meQuery}>
        {({ loading: loadingMeQuery, data: { user } }) => (loadingMeQuery ? null : (
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
                    document: photoCommentAddSubscription,
                    variables: { photoId },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const { onPhotoCommentAdd: payload } = subscriptionData.data;

                      /**
                       * Skip messages of current user
                       * @TODO: Case when currently logged in user sends messages from web
                       */
                      if (payload.edge.node.user.id === user.id) {
                        return prev;
                      }

                      return update(prev, {
                        photo: {
                          comments: {
                            edges: {
                              $unshift: [payload.edge]
                            },
                          },
                        },
                      });
                    }
                  })}
                />
              );
            }}
          </Query>
        ))}
      </Query>
    );
  }
}
