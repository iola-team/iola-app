import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ExtraDimensions from 'react-native-extra-dimensions-android';

import { BackButton } from 'components';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const Indicator = connectToStyleSheet('indicator', Text);
const Footer = connectToStyleSheet('footer', View);

@styleSheet('Sparkle.PhotoPreview', {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#CC0000',
  },
})
export default class PhotoPreview extends Component {
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
    return <Indicator>{`${currentIndex} / ${allSize}`}</Indicator>;
  }

  renderFooter() {
    return (
      <Footer>
        <View>
          <Text style={{ color: '#FFFFFF' }}>Natalie Rose</Text>
          <Text style={{ color: '#FFFFFF' }}>Today at 18:16</Text>
        </View>
        <View>
          <Text style={{ color: '#FFFFFF' }}>Delete</Text>
        </View>
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
            imageUrls={photos}
            index={index}
            onSwipeDown={::this.onClose}
            backgroundColor="rgba(46, 48, 55, 0.95)"
          />
        </Modal>
      </Fragment>
    );
  }
}
