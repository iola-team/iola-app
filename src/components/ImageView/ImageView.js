import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import ImageViewer from 'react-native-image-zoom-viewer';
import ExtraDimensions from 'react-native-extra-dimensions-android';

import { BackButton } from 'components';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const Indicator = connectToStyleSheet('indicator', Text);
const Footer = connectToStyleSheet('footer', View);
const Title = connectToStyleSheet('title', Text);
const DateTime = connectToStyleSheet('dateTime', Text);
const RightBlock = connectToStyleSheet('rightBlock', View);
const ShareButton = connectToStyleSheet('footerButton', IoniconsIcon).withProps({ name: 'ios-share-alt' });
const DeleteButton = connectToStyleSheet('footerButton', FoundationIcon).withProps({ name: 'trash' });

@styleSheet('Sparkle.ImageView', {
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
    marginHorizontal: 17,
    marginBottom: 31,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    paddingBottom: 6,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.06,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  dateTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
  },

  rightBlock: {
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
    photos: PropTypes.array.isRequired,
  };

  state = {
    index: 0,
    visible: false,
  };

  onOpen(index) {
    this.setState({ index, visible: true });
  }

  onClose() {
    this.setState({ visible: false });
  }

  renderHeader() {
    return <BackButton onPress={::this.onClose} />;
  }

  renderIndicator(currentIndex, allSize) {
    return allSize > 1 ? <Indicator>{`${currentIndex} of ${allSize}`}</Indicator> : null;
  }

  renderFooter() {
    return (
      <Footer>
        <View>
          <Title>Natalie Rose</Title>
          <DateTime>Today at 18:16</DateTime>
        </View>
        <RightBlock>
          <ShareButton onPress={() => alert('Share')} />
          <DeleteButton onPress={() => alert('Delete')} />
        </RightBlock>
      </Footer>
    );
  }

  render() {
    const { children, photos } = this.props;
    const { index, visible } = this.state;
    const footerContainerStyle = ({
      width: '100%',
      position: 'absolute',
      bottom: ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT'), // @TODO: iOS
      zIndex: 9999,
    });

    return (
      <Fragment>
        {children(::this.onOpen)}

        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={::this.onClose}
        >
          <ImageViewer
            renderHeader={::this.renderHeader}
            renderIndicator={this.renderIndicator}
            renderFooter={this.renderFooter}
            footerContainerStyle={footerContainerStyle}
            index={index}
            imageUrls={photos}
            failImageSource={{ uri: '@TODO' }}
            loadingRender={() => null /* '@TODO' */}
            onSwipeDown={::this.onClose}
            backgroundColor="rgba(46, 48, 55, 0.95)"
          />
        </Modal>
      </Fragment>
    );
  }
}
