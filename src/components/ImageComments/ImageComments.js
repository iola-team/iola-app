import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { isFunction, isUndefined, noop } from 'lodash';
import update from 'immutability-helper';
import uuid from 'uuid/v4';

import { withStyleSheet } from '~theme';
import ImageCommentsConnection from './ImageCommentsConnection';
import Avatar from '../UserAvatar';
import Backdrop from '../Backdrop';
import TouchableOpacity from '../TouchableOpacity';
import ChatFooter from '../ChatFooter';

const meQuery = gql`
  query meQuery {
    me {
      name
      ...UserAvatar_user
    }
  }

  ${Avatar.fragments.user}
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
        comments @connection(key: "PhotoCommentsConnection") {
          totalCount
        }
      }
    }
  }
`;

@withStyleSheet('Sparkle.ImageComments', {
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
    const { queries: { photoCommentsQuery } } = ImageCommentsConnection;

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
          variables: { id: photoId },
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
          variables: { id: photoId },
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
          variables: { id: photoId },
          data: {
            photo: {
              __typename: 'Photo',
              id: photoId,
              comments: {
                __typename: 'PhotoCommentsConnection',
                totalCount: totalCount + 1,
              },
            },
          },
        });
      },
    });

    if (this.listRef.current && totalCount) {
      this.listRef.current.scrollToIndex({ animated: true, index: 0 });
    }
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

  renderFooter() {
    return (
      <Mutation mutation={addPhotoCommentMutation}>
        {mutate => <ChatFooter onSend={text => this.onCommentSend(text, mutate)} />}
      </Mutation>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles } = this.props;
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
        <>
          <View style={styles.container}>
            <ImageCommentsConnection photoId={photoId} listRef={this.listRef} />
          </View>
          {this.renderFooter()}
        </>
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
