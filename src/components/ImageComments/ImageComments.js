import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { graphql, Mutation, Query, subscribeToMore } from 'react-apollo';
import gql from 'graphql-tag';
import { isFunction, isUndefined, noop, range } from 'lodash';
import update from 'immutability-helper';
import uuid from 'uuid/v4';

import { withStyleSheet } from '~theme';
import ImageCommentsList from '../ImageCommentsList';
import Avatar from '../UserAvatar';
import Backdrop from '../Backdrop';
import TouchableOpacity from '../TouchableOpacity';
import ChatFooter from '../ChatFooter';

const meQuery = gql`
  query meQuery {
    me {
      id
      name
      ...UserAvatar_user
    }
  }

  ${Avatar.fragments.user}
`;

const photoCommentsQuery = gql`
  query PhotoCommentsQuery($id: ID!, $meId: ID!, $cursor: Cursor = null) {
    photo: node(id: $id) {
      ...on Photo {
        id
        
        user {
          id
          hasBlocked(id: $meId)
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

const addPhotoCommentMutation = gql`
  mutation addPhotoCommentMutation($input: PhotoCommentInput!) {
    addPhotoComment(input: $input) {
      node {
        id
        text
        image
        createdAt
      }
    }
  }
`;

const updateCachePhotoCommentsTotalCountQuery = gql`
  query updateCachePhotoCommentsTotalCountQuery($id: ID!) {
    photo: node(id: $id) {
      ...on Photo {
        id
        
        user {
          id
          hasBlocked(id: $meId)
        }
        
        comments @connection(key: "PhotoCommentsConnection") {
          totalCount
        }
      }
    }
  }
`;

@withStyleSheet('iola.ImageComments', {
  titleRow: {
    flexDirection: 'row',
  },

  title: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#45474F',
  },

  count: {
    fontSize: 16,
  },

  container: {
    flex: 1,
    flexGrow: 1,
  },
})
@graphql(meQuery)
export default class ImageComments extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]),
    isVisible: PropTypes.bool,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    isVisible: undefined,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  };

  static getDerivedStateFromProps(props, state) {
    return { isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible };
  }

  state = {
    isVisible: false,
  };

  listRef = React.createRef();

  getModalHeight = () => {
    const { height } = Dimensions.get('window');

    return height * 0.6;
  };

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  hide = () => {
    const { isVisible } = this.props;

    this.setState({
      isVisible: isUndefined(isVisible) ? false : isVisible,
    });
  };

  onShowImageComments = () => {
    const { isVisible } = this.props;

    this.setState({ isVisible: isUndefined(isVisible) ? true : isVisible });
  };

  onCommentSend = async (text, mutate) => {
    const { photoId, totalCount, data: { me } } = this.props;

    mutate({
      variables: {
        input: {
          userId: me.id,
          photoId,
          text,
        },
      },

      optimisticResponse: {
        __typename: 'Mutation',
        addPhotoComment: {
          __typename: 'CommentEdge',
          node: {
            __typename: 'Comment',
            id: uuid(),
            text,
            image: null, // TODO: Add photo upload ability
            createdAt: new Date().toISOString(),
            user: {
              ...me,
              __typename: 'User',
              avatar: {
                ...me.avatar,
                __typename: 'Avatar',
              },
            },
          },
        },
      },

      update: (cache, { data: { addPhotoComment } }) => {
        const data = cache.readQuery({
          query: photoCommentsQuery,
          variables: { id: photoId, meId: me.id },
        });
        const newCommentEdge = {
          __typename: 'CommentEdge',
          node: {
            ...addPhotoComment.node,
            user: me,
          },
          cursor: 'first',
        };

        cache.writeQuery({
          query: photoCommentsQuery,
          variables: { id: photoId, meId: me.id },
          data: update(data, {
            photo: {
              comments: {
                edges: {
                  $unshift: [newCommentEdge],
                },
              },
            },
          }),
        });

        cache.writeQuery({
          query: updateCachePhotoCommentsTotalCountQuery,
          variables: { id: photoId, meId: me.id },
          data: update(data, {
            photo: {
              comments: {
                totalCount: {
                  $set: totalCount + 1,
                },
              },
            },
          }),
        });
      },
    });

    if (this.listRef.current && totalCount) {
      this.listRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  };

  handleLoadMore = ({ comments: { pageInfo } }, fetchMore) => {
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
  };

  renderTitle() {
    const { totalCount, styleSheet: styles } = this.props;
    // TODO: add subscription for totalCount without opened modal?

    return (
      <View style={styles.titleRow}>
        <Text style={styles.title}>Comments</Text>
        {totalCount ? <Text secondary style={styles.count}>{totalCount}</Text> : null}
      </View>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles, data: { me } } = this.props;
    const { isVisible } = this.state;

    return (
      <Backdrop
        height={this.getModalHeight()}
        title={this.renderTitle()}
        isVisible={isVisible}
        onSwipe={this.hide}
        onRequestClose={this.hide}
        headerRight={(
          <TouchableOpacity onPress={this.hide}>
            <Text>Done</Text>
          </TouchableOpacity>
        )}
      >
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
            const isBlockedForMe = photo?.user.hasBlocked || false;

            return (
              <>
                <View style={styles.container}>
                  <ImageCommentsList
                    photoId={photoId}
                    onItemPress={() => null}
                    loading={loading}
                    edges={photo?.comments.edges || []}
                    listRef={this.listRef}
                    onEndReached={() => loading ? null : this.handleLoadMore(photo, fetchMore)}
                    onEndReachedThreshold={2}
                    subscribeToNewComments={subscribeToNewComments}
                    isBlockedForMe={isBlockedForMe}
                  />
                </View>
                <Mutation mutation={addPhotoCommentMutation}>
                  {mutate => <ChatFooter onSend={text => this.onCommentSend(text, mutate)} disabled={isBlockedForMe} />}
                </Mutation>
              </>
            );
          }}
        </Query>
      </Backdrop>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {isFunction(children) ? children(this.onShowImageComments) : children}
        {this.renderModal()}
      </Fragment>
    );
  }
}
