import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { Badge, Text } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import { get } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import Overlay from '../Overlay';
import TouchableOpacity from '../TouchableOpacity';
import ImageComments from '../ImageComments';
import Icon from '../Icon';
import Spinner from '../Spinner';
import ActionSheet from '../ActionSheet';

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
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },

  header: {
    position: 'absolute',
    top: getStatusBarHeight(),
    left: 0,
    right: 0,
    flexDirection: 'row',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 17,
    zIndex: 1,
  },

  headerButton: {
    position: 'relative',
    padding: 15,
  },

  headerIcon: {
    fontSize: 14,
  },

  backButton: {
    marginRight: 'auto',
    padding: 15,
    zIndex: 1,
  },

  meatballMenu: {
    position: 'relative',
    marginLeft: 'auto',
    padding: 15,
  },

  indicator: {
    width: '100%',
    position: 'absolute',
    top: 14,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 17,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 25,
    paddingHorizontal: 17,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
    zIndex: 1,
  },

  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    paddingRight: 7,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    color: '#FFFFFF',
  },

  caption: {
    paddingTop: 10,
    paddingBottom: 19,
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  dateTime: {
    paddingBottom: 19,
    fontSize: 14,
    lineHeight: 17,
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
  },

  actionBadge: {
    height: 16,
    marginLeft: 7,
    paddingVertical: 0,
    backgroundColor: '#BDC0CB',
  },

  actionBadgeText: {
    fontSize: 12,
    lineHeight: 16,
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

  getDateHumanized = (timestamp) => {
    let result = '';

    if (timestamp) {
      const date = moment.duration(moment(timestamp).diff(moment())).humanize();

      result = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;
    }

    return result;
  };

  renderControls() {
    const { edges, data: { me }, styleSheet: styles } = this.props;
    const { index } = this.state;
    const { node: { id } } = edges[index];
    const totalCountImages = edges.length;

    /*
     * firstPhotoId is using for optimization:
     * Currently, all photos in she slider will have the same user data
     * (so we don't need to get it for every photo)
     */
    const firstPhotoId = get(edges, `[0].node.id`, null);

    return (
      <Query query={photoDetailsQuery} variables={{ id: firstPhotoId }} skip={!id}>
        {({ data: firstPhotoData }) => (
          <Query query={photoDetailsQuery} variables={{ id }}>
            {({ loading, data }) => {
              const photo = data?.photo;
              const caption = photo?.caption || '';
              const photoId = photo?.id || '';
              const totalCount = photo?.comments?.totalCount || 0;
              const createdAt = this.getDateHumanized(photo?.createdAt || 0);
              // const totalCountLikes = 0; // @TODO: Likes

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

                    {me.id === firstPhotoData?.photo?.user?.id && (
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
                      {firstPhotoData?.photo && (
                        <View style={styles.nameBlock}>
                          <Text style={styles.name}>{firstPhotoData.photo.user.name}</Text>
                        </View>
                      )}
                      {!!caption && <Text style={styles.caption}>{caption}</Text>}
                      <Text secondary style={styles.dateTime}>{createdAt}</Text>
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
        )}
      </Query>
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
              failImageSource="https://thewindowsclub-thewindowsclubco.netdna-ssl.com/wp-content/uploads/2018/06/Broken-image-icon-in-Chrome.gif" /* @TODO */
              loadingRender={() => <View style={styles.spinnerContainer}><Spinner /></View>}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
              pageAnimateTime={400}
              enablePreload
            />

            {isVisible && this.renderControls()}
          </View>
        </Overlay>
      </>
    );
  }
}
