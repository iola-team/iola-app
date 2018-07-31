import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StatusBar, Modal, Text, View } from 'react-native';
import { Badge, Spinner } from 'native-base';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import BackButton from '../BackButton';
import TouchableOpacity from '../TouchableOpacity';

const ModalContent = connectToStyleSheet('modalContent', View);
const Header = connectToStyleSheet('header', View);
const Indicator = connectToStyleSheet('indicator', Text);
const Footer = connectToStyleSheet('footer', View);
const Name = connectToStyleSheet('name', Text);
const Caption = connectToStyleSheet('caption', Text);
const DateTime = connectToStyleSheet('dateTime', Text);
const InfoBlock = connectToStyleSheet('infoBlock', View);
const ActionsBlock = connectToStyleSheet('actionsBlock', View);
const LikeIcon = connectToStyleSheet('actionIcon', IoniconsIcon).withProps({ name: 'ios-heart-outline' });
const CommentIcon = connectToStyleSheet('actionIcon', EvilIcons).withProps({ name: 'comment' });
const ShareIcon = connectToStyleSheet('actionIcon', IoniconsIcon).withProps({ name: 'ios-share-alt' });
const ActionButton = connectToStyleSheet('actionButton', TouchableOpacity);
const ActionText = connectToStyleSheet('actionText', Text);
const ActionBadge = connectToStyleSheet('actionBadge', Badge);
const ActionBadgeText = connectToStyleSheet('actionBadgeText', Text);

@styleSheet('Sparkle.ImageView', {
  modalContent: {
    // @TODO: use mixin
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    width: Dimensions.get('window').width,
  },

  header: {
    position: 'absolute',
    zIndex: 1000,
  },

  indicator: {
    width: '100%',
    position: 'absolute',
    top: 15,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
    zIndex: 999,
  },

  footer: {
    paddingTop: 25,
    paddingBottom: 29,
    paddingHorizontal: 17,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
  },

  infoBlock: {
    // flexShrink: 1,
  },

  name: {
    paddingBottom: 7,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.06,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  caption: {
    paddingBottom: 19,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  dateTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
  },

  actionsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#BDC0CB',
  },

  actionButton: {
    flexDirection: 'row',
  },

  actionIcon: {
    marginRight: 5,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
    color: '#BDC0CB',
  },

  actionText: {
    color: '#BDC0CB',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
  },

  actionBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#BDC0CB',
  },

  actionBadgeText: {
    color: '#FFFFFF',
  },
})
export default class ImageView extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    onShowComments: PropTypes.func.isRequired,
  };

  state = {
    index: 0,
    visible: false,
  };

  onShowImage(index) {
    this.setState({ index, visible: true });
  }

  onChange(index) {
    this.setState({ index });
  }

  onClose() {
    this.setState({ visible: false });
  }

  renderHeader() {
    return (
      <Header>
        <BackButton onPress={::this.onClose} />
      </Header>
    );
  }

  renderIndicator(currentIndex, allSize) {
    return allSize > 1 ? <Indicator>{`${currentIndex} of ${allSize}`}</Indicator> : null;
  }

  renderFooter() {
    const { images, onShowComments } = this.props;
    const { index } = this.state;
    const { name, caption, createdAt, totalCountLikes, totalCountComments } = images[index];
    const date = moment.duration(moment(createdAt).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;

    return (
      <Footer>
        <InfoBlock>
          <Name>{name}</Name>
          <Caption>{caption}</Caption>
          <DateTime>{dateFormatted}</DateTime>
        </InfoBlock>

        <ActionsBlock>
          <ActionButton onPress={() => alert('Like')}>
            <LikeIcon />
            <ActionText>Like</ActionText>
            {totalCountLikes ? (
              <ActionBadge>
                <ActionBadgeText>{totalCountLikes}</ActionBadgeText>
              </ActionBadge>
            ) : null}
          </ActionButton>
          <ActionButton onPress={onShowComments}>
            <CommentIcon />
            <ActionText>Comment</ActionText>
            {totalCountComments ? (
              <ActionBadge>
                <ActionBadgeText>{totalCountComments}</ActionBadgeText>
              </ActionBadge>
            ) : null}
          </ActionButton>
          <ActionButton onPress={() => alert('Share')}>
            <ShareIcon />
            <ActionText>Share</ActionText>
          </ActionButton>
        </ActionsBlock>
      </Footer>
    );
  }

  render() {
    const { children, images } = this.props;
    const { index, visible } = this.state;

    return (
      <Fragment>
        {children(::this.onShowImage)}

        <Modal
          visible={visible}
          animationType="fade"
          onRequestClose={::this.onClose}
          transparent
        >
          <ModalContent>
            <ImageViewer
              imageUrls={images}
              index={index}
              onChange={::this.onChange}
              onSwipeDown={::this.onClose}
              renderHeader={::this.renderHeader}
              renderIndicator={this.renderIndicator}
              renderFooter={::this.renderFooter}
              failImageSource={{ uri: 'https://thewindowsclub-thewindowsclubco.netdna-ssl.com/wp-content/uploads/2018/06/Broken-image-icon-in-Chrome.gif' }}
              loadingRender={() => <Spinner />}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
            />
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}
