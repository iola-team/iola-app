import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { isFunction, isUndefined, noop } from 'lodash';

import { withStyleSheet as styleSheet } from 'theme';
import NoComments from './NoComments';
import Modal from '../Modal';
import UserOnlineStatus from '../UserOnlineStatus';
import UserAvatar from '../UserAvatar';

const getModalHeight = () => {
  const { height } = Dimensions.get('window');

  return height * 0.75;
};

const photoCommentsQuery = gql`
  query photoCommentsQuery($id: ID!) {
    photo: node(id: $id) {
      ...on Photo {
        id
        comments {
          totalCount
          edges {
            node {
              id
              text
              createdAt
              user {
                id
                name
                avatar {
                  id
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

@styleSheet('Sparkle.ImageComments', {
  modal: {
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
      minHeight: getModalHeight(),
      paddingVertical: 24,
      paddingHorizontal: 15,
      backgroundColor: '#F8F9FB',
    },
  },

  comment: {
    container: {
      flexDirection: 'row',
      marginBottom: 8,
    },

    avatar: {
      marginRight: 8,
    },

    content: {
      flex: 1,
      paddingVertical: 13,
      paddingHorizontal: 15,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
        // @TODO: box-shadow
        shadowColor: '#E1E6ED',
        shadowRadius: 4,
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        elevation: 1,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    name: {
      marginRight: 8,
      fontFamily: 'SF Pro Text',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 16,
      color: '#45474F',
    },

    text: {
      paddingVertical: 6,
      fontFamily: 'SF Pro Text',
      fontSize: 14,
      lineHeight: 17,
      color: '#45474F',
    },

    createdAt: {
      fontFamily: 'SF Pro Text',
      fontSize: 14,
      lineHeight: 16,
      color: '#BDC0CB',
    },
  },
})
export default class ImageComments extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
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

  onShowImageComments = () => {
    const { isVisible } = this.props;

    this.setState({ isVisible: isUndefined(isVisible) ? true : isVisible });
  };

  hide = () => {
    const { isVisible } = this.props;

    this.setState({
      isVisible: isUndefined(isVisible) ? false : isVisible,
    });
  };

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  renderTitle = (count) => {
    const { styleSheet: styles } = this.props;

    return (
      <View style={styles.modal.titleRow}>
        <Text style={styles.modal.title}>Comments</Text>
        {count ? <Text style={styles.modal.count}>{count}</Text> : null}
      </View>
    );
  };

  renderComments(comments) {
    if (!comments.length) {
      return <NoComments height={getModalHeight()} />;
    }

    const { styleSheet: styles } = this.props;

    return (
      <Fragment>
        {comments.map((comment) => {
          const { node: { id, text, createdAt, user } } = comment;
          const date = moment.duration(moment(createdAt).diff(moment())).humanize();
          const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;
          const isOnline = true;

          return (
            <View key={id} style={styles.comment.container}>
              <UserAvatar user={user} style={styles.comment.avatar} />
              <View style={styles.comment.content}>
                <View style={styles.comment.nameRow}>
                  <Text style={styles.comment.name}>{user.name}</Text>
                  <UserOnlineStatus isOnline={isOnline} />
                </View>
                <Text style={styles.comment.text}>{text}</Text>
                <Text style={styles.comment.createdAt}>{dateFormatted}</Text>
              </View>
            </View>
          );
        })}
      </Fragment>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles } = this.props;
    const { isVisible } = this.state;

    return (
      <Query query={photoCommentsQuery} variables={{ id: photoId }}>
        {({ loading, data: { photo } }) => (loading ? null : ( // @TODO: add spinner
          <Modal
            title={this.renderTitle(photo.comments.totalCount)}
            height={getModalHeight()}
            isVisible={isVisible}
            onDone={this.action('onDone', this.hide)}
            onDismiss={this.action('onDismiss')}
            onShow={this.action('onShow')}
            onSwipe={this.action('onSwipe', this.hide)}
            onCancel={this.action('onCancel', this.hide)}
            onRequestClose={this.action('onRequestClose', this.hide)}
          >
            <View style={styles.modal.container}>
              {this.renderComments(photo.comments.edges)}
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
