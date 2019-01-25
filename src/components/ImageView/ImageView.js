import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StatusBar, Modal, Text, View } from 'react-native';
import { Badge, Spinner } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import Icon from '../Icon';
import UserOnlineStatus from '../UserOnlineStatus';
import TouchableOpacity from '../TouchableOpacity';
import ImageComments from '../ImageComments';

const SpinnerContainer = connectToStyleSheet('spinnerContainer', View);
const NameBlock = connectToStyleSheet('nameBlock', View);
const Name = connectToStyleSheet('name', Text);
const Caption = connectToStyleSheet('caption', Text);
const DateTime = connectToStyleSheet('dateTime', Text);
const ActionsBlock = connectToStyleSheet('actionsBlock', View);
const ActionText = connectToStyleSheet('actionText', Text);
const ActionBadge = connectToStyleSheet('actionBadge', Badge);
const ActionBadgeText = connectToStyleSheet('actionBadgeText', Text);

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

        comments @connection(key: "comments-totalcount") {
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

  closeButton: {
    marginLeft: 'auto',
  },

  close: {
    margin: 14,
    fontSize: 14,
    color: '#BDC0CB',
  },

  footer: {
    paddingTop: 25,
    paddingHorizontal: 17,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
    pointerEvents: 'none', // @TODO: it doesn't help
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
export default class ImageView extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
  };

  state = {
    index: 0,
    visible: false,
  };

  onShowImage({ item, index }) {
    this.setState({ index, visible: true });
  }

  onChange(index) {
    this.setState({ index });
  }

  onClose() {
    this.setState({ visible: false });
  }

  renderControls() {
    const { edges, styleSheet: styles } = this.props;
    const { index } = this.state;
    const { node: { id } } = edges[index];
    const totalCountImages = edges.length;

    return (
      <View style={styles.controls}>
        <Query query={photoDetailsQuery} variables={{ id }}>
          {({ loading, data }) => {
            if (loading) return null; // @TODO: add spinner

            const {
              id,
              caption,
              createdAt,
              user: {
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
              <Fragment>
                <View style={styles.header}>
                  {totalCountImages > 1 && (
                    <Text style={styles.indicator}>
                      {`${index + 1} of ${totalCountImages}`}
                    </Text>
                  )}
                  <TouchableOpacity onPress={::this.onClose} style={styles.closeButton}>
                    <Icon name="close" style={styles.close} />
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <View>
                    <NameBlock>
                      <Name>{name}</Name>
                      <UserOnlineStatus isOnline={isOnline} />
                    </NameBlock>
                    <Caption>{caption}</Caption>
                    <DateTime>{dateFormatted}</DateTime>
                  </View>

                  <ActionsBlock>
                    <ImageComments photoId={id} totalCount={totalCount}>
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
                  </ActionsBlock>
                </View>
              </Fragment>
            );
          }}
        </Query>
      </View>
    );
  }

  render() {
    const { edges, styleSheet: styles, children } = this.props;
    const { index, visible } = this.state;
    const imageUrls = edges.map(({ node: { url } }) => ({ url }));

    return (
      <Fragment>
        {children(::this.onShowImage)}

        <Modal
          visible={visible}
          animationType="fade"
          onRequestClose={::this.onClose}
          transparent
        >
          <View style={styles.content}>
            <ImageViewer
              imageUrls={imageUrls}
              index={index}
              onChange={::this.onChange}
              onSwipeDown={::this.onClose}
              renderIndicator={() => null}
              failImageSource={{ uri: 'https://thewindowsclub-thewindowsclubco.netdna-ssl.com/wp-content/uploads/2018/06/Broken-image-icon-in-Chrome.gif' /* @TODO */ }}
              loadingRender={() => <SpinnerContainer><Spinner /></SpinnerContainer>}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
            />

            {visible && this.renderControls()}
          </View>
        </Modal>
      </Fragment>
    );
  }
}
