import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { graphql, Mutation } from 'react-apollo';
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
        comments {
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

  imageCommentsListForwardedRef = React.createRef();

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

        data.photo.comments.edges.unshift({
          __typename: 'CommentEdge',
          node: {
            ...addPhotoComment.node,
            user: me,
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

    if (this.imageCommentsListForwardedRef.current) {
      this.imageCommentsListForwardedRef.current.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  };

  renderTitle() {
    const { totalCount, styleSheet: styles } = this.props;

    return (
      <View style={styles.titleRow}>
        <Text style={styles.title}>Comments</Text>
        {totalCount ? <Text style={styles.count}>{totalCount}</Text> : null}
      </View>
    );
  }

  renderFooter() {
    return (
      <Mutation mutation={addPhotoCommentMutation}>
        {/*
          * @TODO: It would be great to have a generic component
          * eg bottom bar input or form, to not be tied to a particular feature.
          * This component will be used in both features (Chat and comments).
          */}
        {mutate => <ChatFooter onSend={text => this.onCommentSend(text, mutate)} />}
      </Mutation>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles } = this.props;
    const { isVisible } = this.state;

    return (
      <Modal
        title={this.renderTitle()}
        height={getModalHeight()}
        footer={this.renderFooter()}
        isVisible={isVisible}
        onDone={this.action('onDone', this.hide)}
        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onCancel={this.action('onCancel', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}
        noScrollViewForContent
      >
        <View style={styles.container}>
          <ImageCommentsConnection
            photoId={photoId}
            imageCommentsListForwardedRef={this.imageCommentsListForwardedRef}
          />
        </View>
      </Modal>
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
