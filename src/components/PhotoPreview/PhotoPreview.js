import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class PhotoPreview extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
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

  // renderHeader() {
  //   return <Text>TEST</Text>;
  // }

  renderIndicator(currentIndex, allSize) {
    return <Text>{`${currentIndex} / ${allSize}`}</Text>;
  }

  render() {
    const { images } = this.props;
    const { index, visible } = this.state;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={::this.onClose}
      >
        <ImageViewer
          renderIndicator={::this.renderIndicator}
          imageUrls={images}
          index={index}
          onSwipeDown={::this.onClose}
          backgroundColor="#2E3037"
        />
      </Modal>
    );
  }
}
