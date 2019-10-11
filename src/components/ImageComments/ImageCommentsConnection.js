import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, subscribeToMore } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { propType as graphqlPropType } from 'graphql-anywhere';
import { noop, range } from 'lodash';
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
  query PhotoCommentsQuery($id: ID!, $meId: ID!, $cursor: Cursor = null) {
    photo: node(id: $id) {
      ...on Photo {
        id
        
        user {
          id
          isBlocked(by: $meId)
          hasBlocked(for: $meId)
        }
        
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

const unblockUserMutation = gql`
  mutation UserActionsUnblockUser($userId: ID!, $blockedUserId: ID!) {
    unblockUser(input: {
      userId: $userId
      blockedUserId: $blockedUserId
    }) {
      unblockedUser {
        id
        isBlocked(by: $userId)
      }
    }
  }
`;

@graphql(unblockUserMutation, { name: 'unblockUserMutation' })
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

  handleLoadMore({ comments: { pageInfo } }, fetchMore) {
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

  unblockUser = async (me, photo) => {
    const user = photo?.user;

    if (!user) return;

    await this.props.unblockUserMutation({
      variables: { userId: me.id, blockedUserId: user.id },
      optimisticResponse: {
        unblockUser: {
          __typename: 'UnblockUserPayload',
          unblockedUser: {
            ...user,
            isBlocked: false,
          },
        },
      },
    });
  };

  render() {
    const { photoId, onItemPress, listRef } = this.props;

    return (
      <Query query={meQuery}>
        {({ data: { me } }) => (
          <Query query={photoCommentsQuery} variables={{ id: photoId, meId: me.id }}>
            {({ loading, data: { photo }, fetchMore, subscribeToMore }) => {
              const subscribeToNewComments = () => subscribeToMore({
                document: photoCommentAddSubscription,
                variables: { photoId },
                shouldResubscribe: true,

                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const { onPhotoCommentAdd: payload } = subscriptionData.data;

                  /**
                   * Skip messages of current user
                   * TODO: Case when currently logged in user sends messages from web
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
                  edges={photo?.comments.edges || []}
                  listRef={listRef}
                  onEndReached={() => loading ? null : this.handleLoadMore(photo, fetchMore)}
                  onEndReachedThreshold={2}
                  subscribeToNewComments={subscribeToNewComments}
                  isBlockedByMe={photo?.user.isBlocked || false}
                  isBlockedForMe={photo?.user.hasBlocked || false}
                  unblockUser={() => this.unblockUser(me, photo)}
                />
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}
