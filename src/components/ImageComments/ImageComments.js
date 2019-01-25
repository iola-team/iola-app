import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { isFunction, isUndefined, noop } from 'lodash';
import uuid from 'uuid/v4';

import { withStyleSheet as styleSheet } from 'theme';
import Avatar from '../UserAvatar';
import Modal from '../Modal';
import ChatFooter from '../ChatFooter';
import ImageCommentsConnection from './ImageCommentsConnection';

const getModalHeight = () => {
  const { height } = Dimensions.get('window');
  const headerHeight = 62;
  const footerHeight = 40;

  return height * 0.75 - headerHeight - footerHeight;
};

const meQuery = gql`
  query meQuery {
    user: me {
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
        comments @connection(key: "comments-totalcount") {
          totalCount
        }
      }
    }
  }
`;

@styleSheet('Sparkle.ImageComments', {
  titleRow: {
    flexDirection: 'row',
  },

  title: {
    marginRight: 5,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#45474F',
  },

  count: {
    fontSize: 16,
    color: '#BDC0CB',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FB',
  },
})
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

  onCommentSend = async (text, user, mutate) => {
    const { photoId, totalCount } = this.props;
    const { queries: { photoCommentsQuery } } = ImageCommentsConnection;

    mutate({
      variables: {
        input: {
          userId: user.id,
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
            createdAt: new Date().toISOString(),
            user: {
              ...user,
              __typename: 'User',
              avatar: {
                ...user.avatar,
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

        data.photo.comments.edges.unshift({
          __typename: 'CommentEdge',
          node: {
            ...addPhotoComment.node,
            user,
          },
          cursor: 'first',
        });

        cache.writeQuery({
          query: photoCommentsQuery,
          variables: { id: photoId },
          data,
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
    // @TODO: add subscription for totalCount without opened modal?

    return (
      <View style={styles.titleRow}>
        <Text style={styles.title}>Comments</Text>
        {totalCount ? <Text style={styles.count}>{totalCount}</Text> : null}
      </View>
    );
  }

  renderFooter(user) {
    return (
      <Mutation mutation={addPhotoCommentMutation}>
        {mutate => <ChatFooter onSend={text => this.onCommentSend(text, user, mutate)} />}
      </Mutation>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles } = this.props;
    const { isVisible } = this.state;

    return (
      <Query query={meQuery}>
        {({ loading, data: { user } }) => (loading ? null : (
          <Modal
            title={this.renderTitle()}
            height={getModalHeight()}
            footer={this.renderFooter(user)}
            isVisible={isVisible}
            onDone={this.hide}
            onSwipe={this.hide}
            onRequestClose={this.hide}
            noScrollViewForContent
          >
            <View style={styles.container}>
              <ImageCommentsConnection photoId={photoId} listRef={this.listRef} />
            </View>
          </Modal>
        ))}
      </Query>
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
