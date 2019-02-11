import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StatusBar, Text, View } from 'react-native';
import { Badge } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet } from 'theme';
import Overlay from '../Overlay';
import TouchableOpacity from '../TouchableOpacity';
import ActionSheet from '../ActionSheet';
import ImageComments from '../ImageComments';
import UserOnlineStatus from '../UserOnlineStatus';
import Icon from '../Icon';
import Spinner from '../Spinner';

const meQuery = gql`
  query meQuery {
    me {
      id
    }
  }
`;

const edgeFragment = gql`
  fragment ImageView_edge on PhotoEdge {
    node {
      id
      ...on Photo {
        id
        url
      }
    }
  }
`;

export const photoDetailsQuery = gql`
  query photoDetailsQuery($id: ID!) {
    photo: node(id: $id) {
      ...on Photo {
        id
        url
        caption
        createdAt

        user {
          id
          name
        }

        comments @connection(key: "PhotoCommentsConnection") {
          totalCount
        }
      }
    }
  }
`;

@styleSheet('Sparkle.ImageView', {
  spinnerContainer: {
    margin: 'auto',
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    position: 'relative',
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    width: Dimensions.get('window').width,
  },

  controls: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  header: {
    flexDirection: 'row',
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
    zIndex: 999,
  },

  headerButton: {
    position: 'relative',
    padding: 15,
    zIndex: 1,
  },

  headerIcon: {
    fontSize: 14,
    color: '#BDC0CB',
  },

  backButton: {
    position: 'relative',
    marginRight: 'auto',
    padding: 15,
    zIndex: 1,
  },

  meatballMenu: {
    position: 'relative',
    marginLeft: 'auto',
    padding: 15,
    zIndex: 1,
  },

  indicator: {
    width: '100%',
    position: 'absolute',
    top: 14,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
  },

  footer: {
    paddingTop: 25,
    paddingHorizontal: 17,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
    pointerEvents: 'none', // @TODO: it doesn't work
  },

  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    paddingRight: 7,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    color: '#FFFFFF',
  },

  caption: {
    paddingTop: 10,
    paddingBottom: 19,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  dateTime: {
    paddingBottom: 19,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
  },

  actionsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderTopWidth: 1,
    borderTopColor: 'rgba(189, 192, 203, 0.5)',
  },

  actionButton: {
    flexDirection: 'row',
  },

  buttonComments: {
    marginRight: 31,
  },

  actionIcon: {
    marginRight: 8,
    fontSize: 16,
    color: '#C5CAD1',
  },

  actionText: {
    color: '#AFB2BF',
    fontSize: 14,
    fontFamily: 'SF Pro Text',
  },

  actionBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
    marginTop: 2,
    height: 16,
    backgroundColor: '#BDC0CB',
  },

  actionBadgeText: {
    paddingVertical: 0,
    fontSize: 12,
    lineHeight: 58,
    color: '#FFFFFF',
  },
})
@graphql(meQuery)
export default class ImageView extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
    deletePhoto: PropTypes.func.isRequired,
  };

  state = {
    index: 0,
    isVisible: false,
  };

  onShowImage({ item, index }) {
    this.setState({ index, isVisible: true });
  }

  onChange(index) {
    this.setState({ index });
  }

  onClose() {
    this.setState({ isVisible: false });
  }

  onDelete(photoId) {
    const { edges, deletePhoto } = this.props;
    const { index } = this.state;

    deletePhoto(photoId);

    if (edges.length === 1) {
      this.setState({ isVisible: false });
      return;
    }

    if (index === 1) {
      this.setState({ index: index + 1 });
      return;
    }

    if (index) {
      this.setState({ index: index - 1 });
    }
  }

  renderControls() {
    const { edges, data: { me }, styleSheet: styles } = this.props;
    const { index } = this.state;
    const { node: { id } } = edges[index];
    const totalCountImages = edges.length;

    return (
      <View style={styles.controls}>
        <Query query={photoDetailsQuery} variables={{ id }}>
          {({ loading, data }) => {
            if (loading) return null; // @TODO: add spinner

            const {
              id: photoId,
              caption,
              createdAt,
              user: {
                id: userId,
                name,
                // isOnline, // @TODO: isOnline
              },
              comments: {
                totalCount,
              },
              // totalCountLikes, // @TODO: Likes
            } = data.photo;
            const isOnline = false; // @TODO: isOnline
            // const totalCountLikes = 0; // @TODO: Likes
            const date = moment.duration(moment(createdAt).diff(moment())).humanize();
            const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;

            return (
              <>
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={::this.onClose}
                    style={[styles.headerButton, styles.backButton]}
                  >
                    <Icon style={styles.headerIcon} name="back" />
                  </TouchableOpacity>

                  {totalCountImages > 1 && (
                    <Text style={styles.indicator}>
                      {`${index + 1} of ${totalCountImages}`}
                    </Text>
                  )}

                  {me.id === userId && (
                    <ActionSheet
                      options={['Cancel', 'Delete']}
                      cancelButtonIndex={0}
                      destructiveButtonIndex={1}
                      onPress={index => index === 1 && this.onDelete(photoId)}
                    >
                      {show => (
                        <TouchableOpacity
                          onPress={show}
                          style={[styles.headerButton, styles.meatballMenu]}
                        >
                          <Icon style={styles.headerIcon} name="emoji" /* @TODO: meatball icon */ />
                        </TouchableOpacity>
                      )}
                    </ActionSheet>
                  )}
                </View>

                <View style={styles.footer}>
                  <View>
                    <View style={styles.nameBlock}>
                      <Text style={styles.name}>{name}</Text>
                      <UserOnlineStatus isOnline={isOnline} />
                    </View>
                    <Text style={styles.caption}>{caption}</Text>
                    <Text style={styles.dateTime}>{dateFormatted}</Text>
                  </View>

                  <View style={styles.actionsBlock}>
                    <ImageComments photoId={photoId} totalCount={totalCount}>
                      {onShowImageComments => (
                        <TouchableOpacity
                          onPress={onShowImageComments}
                          style={[styles.actionButton, styles.buttonComments]}
                        >
                          <Icon name="chats-bar" style={styles.actionIcon} />
                          <Text style={styles.actionText}>Comment</Text>
                          {!totalCount ? null : (
                            <Badge style={styles.actionBadge}>
                              <Text style={styles.actionBadgeText}>{totalCount}</Text>
                            </Badge>
                          )}
                        </TouchableOpacity>
                      )}
                    </ImageComments>

                    {/* @TODO: Likes
                    <TouchableOpacity onPress={() => alert('Like')} style={styles.actionButton}>
                      <Icon name="like" style={styles.actionIcon} />
                      <ActionText>Like</ActionText>
                      {totalCountLikes ? (
                        <ActionBadge>
                          <ActionBadgeText>{totalCountLikes}</ActionBadgeText>
                        </ActionBadge>
                      ) : null}
                    </TouchableOpacity>
                    */}
                  </View>
                </View>
              </>
            );
          }}
        </Query>
      </View>
    );
  }

  render() {
    const { edges, styleSheet: styles, children } = this.props;
    const { index, isVisible } = this.state;
    const imageUrls = edges.map(({ node: { url } }) => ({ url }));

    return (
      <>
        {children(::this.onShowImage)}

        <Overlay visible={isVisible} onRequestClose={::this.onClose}>
          <View style={styles.content}>
            <ImageViewer
              imageUrls={imageUrls}
              index={index}
              onChange={::this.onChange}
              onSwipeDown={::this.onClose}
              renderIndicator={() => null}
              failImageSource={{ uri: 'https://thewindowsclub-thewindowsclubco.netdna-ssl.com/wp-content/uploads/2018/06/Broken-image-icon-in-Chrome.gif' /* @TODO */ }}
              loadingRender={() => <View style={styles.spinnerContainer}><Spinner /></View>}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
            />

            {isVisible && this.renderControls()}
          </View>
        </Overlay>
      </>
    );
  }
}
