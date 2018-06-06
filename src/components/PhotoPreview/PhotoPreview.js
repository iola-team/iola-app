import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import { BackButton } from 'components';
import { withStyleSheet as styleSheet } from 'theme';
import {connectToStyleSheet} from "../../theme";

const Indicator = connectToStyleSheet('indicator', Text);

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
    return <Text style={{
      position: 'relative',
      top: 15,
      color: '#FFFFFF',
      zIndex: 9999,
    }}>FOOTER</Text>;
  }

  render() {
    const { children, photos } = this.props;
    const { index, visible } = this.state;

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
            imageUrls={photos}
            index={index}
            onSwipeDown={::this.onClose}
            backgroundColor="#2E3037"
          />
        </Modal>
      </Fragment>
    );
  }
}
