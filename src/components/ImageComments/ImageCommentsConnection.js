import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, subscribeToMore } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';
import { get, noop, range } from 'lodash';
import update from 'immutability-helper';

import ImageCommentsList from '../ImageCommentsList';

const meQuery = gql`
  query meQuery {
    me {
      id
    }
  }
`;

const photoCommentsQuery = gql`
  query PhotoCommentsQuery($id: ID!, $cursor: Cursor = null) {
    photo: node(id: $id) {
      ...on Photo {
        id
        comments(first: 10 after: $cursor) @connection(key: "PhotoCommentsConnection") {
          totalCount

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

  ${ImageCommentsList.fragments.edge}
`;

export default class ImageCommentsConnection extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    onItemPress: PropTypes.func,
    photoCommentsQuery: graphqlPropType(photoCommentsQuery),
    listRef: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onItemPress: noop,
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

      updateQuery: (prev, { fetchMoreResult: { photo } }) => {
        const { comments } = photo;

        if (!comments || !comments.edges.length) {
          return prev;
        }

        return update(prev, {
          photo: {
            comments: {
              edges: {
                $push: comments.edges,
              },
              pageInfo: {
                $merge: comments.pageInfo,
              }
            },
          },
        });
      }
    }).then(() => {
      this.fetchMorePromise = null;
    });
  }

  render() {
    const { photoId, onItemPress, listRef } = this.props;

    return (
      <Query query={meQuery}>
        {({ loading: loadingMeQuery, data: { me } }) => loadingMeQuery ? null : (
          <Query query={photoCommentsQuery} variables={{ id: photoId }}>
            {({ loading, data, fetchMore, refetch, networkStatus, subscribeToMore }) => {
              const refreshing = networkStatus === NetworkStatus.refetch;
              const edges = get(data, 'photo.comments.edges', []);
              const onEndReached = () => loading ? null : this.handleLoadMore(data, fetchMore);
              const subscribeToNewComments = () => subscribeToMore({
                document: photoCommentAddSubscription,
                variables: { photoId },
                shouldResubscribe: true,

                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const { onPhotoCommentAdd: payload } = subscriptionData.data;

                  /**
                   * Skip messages of current user
                   * @TODO: Case when currently logged in user sends messages from web
                   */
                  if (payload.edge.node.user.id === me.id) {
                    return prev;
                  }

                  return update(prev, {
                    photo: {
                      comments: {
                        totalCount: {
                          $set: prev.photo.comments.totalCount + 1,
                        },
                        edges: {
                          $unshift: [payload.edge],
                        },
                      },
                    },
                  });
                },
              });

              return (
                <ImageCommentsList
                  photoId={photoId}
                  onItemPress={onItemPress}
                  loading={loading}
                  refreshing={refreshing}
                  edges={edges}
                  onRefresh={refetch}
                  listRef={listRef}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={2}
                  inverted={!!edges}
                  subscribeToNewComments={subscribeToNewComments}
                />
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}
