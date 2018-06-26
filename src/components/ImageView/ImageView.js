import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StatusBar, Modal, Text, View } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { BackButton } from 'components';

const ModalContent = connectToStyleSheet('modalContent', View);
const Header = connectToStyleSheet('header', View);
const Indicator = connectToStyleSheet('indicator', Text);
const Footer = connectToStyleSheet('footer', View);
const Name = connectToStyleSheet('name', Text);
const Caption = connectToStyleSheet('caption', Text);
const DateTime = connectToStyleSheet('dateTime', Text);
const LeftBlock = connectToStyleSheet('leftBlock', View);
const RightBlock = connectToStyleSheet('rightBlock', View);
const ShareButton = connectToStyleSheet('footerButton', IoniconsIcon).withProps({ name: 'ios-share-alt' });
const DeleteButton = connectToStyleSheet('footerButton', FoundationIcon).withProps({ name: 'trash' });

@styleSheet('Sparkle.ImageView', {
  modalContent: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    width: Dimensions.get('window').width,
    backgroundColor: 'red',
  },

  header: {
    position: 'absolute',
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
    zIndex: 9999,
  },

  footer: {
    paddingTop: 25,
    paddingBottom: 29,
    paddingHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
  },

  leftBlock: {
    flexShrink: 1,
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

  rightBlock: {
    flexShrink: 0,
    width: (24 * 2 + 14),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerButton: {
    height: 24,
    width: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(189, 192, 203, 0.25)',
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    color: '#BDC0CB',
  },
})
export default class ImageView extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
  };

  state = {
    index: 0,
    visible: false,
  };

  onOpen(index) {
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
    const { images } = this.props;
    const { index } = this.state;
    const { name, caption, createdAt } = images[index];
    const date = moment.duration(moment(createdAt * 1000).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;

    return (
      <Footer>
        <LeftBlock>
          <Name>{name}</Name>
          <Caption>{caption}</Caption>
          <DateTime>{dateFormatted}</DateTime>
        </LeftBlock>
        <RightBlock>
          <ShareButton onPress={() => alert('Share')} />
          <DeleteButton onPress={() => alert('Delete')} />
        </RightBlock>
      </Footer>
    );
  }

  render() {
    const { children, images } = this.props;
    const { index, visible } = this.state;

    return (
      <Fragment>
        {children(::this.onOpen)}

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
              failImageSource={{ uri: '@TODO' }}
              loadingRender={() => null /* '@TODO' */}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
            />
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}
