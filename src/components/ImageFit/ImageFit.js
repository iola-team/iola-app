import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import { withStyleSheet as styleSheet } from 'theme';
import brokenImage from './broken.png';

@styleSheet('Sparkle.ImageFit', {
  backgroundColor: '#CC0000',
  resizeMode: 'contain',
})
export default class ImageFit extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    maxWidth: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  };

  static defaultProps = {
    style: {},
  };

  state = {
    failedToLoad: false,
    width: 0,
    height: 0,
  };

  componentDidMount() {
    const { url, maxWidth, maxHeight } = this.props;

    Image.getSize(url, (realWidth, realHeight) => {
      let width = maxWidth;
      let height = maxHeight;

      if (maxWidth < realWidth || maxHeight < realHeight) {
        const coefficientByWidth = realWidth / maxWidth;

        width = realWidth / coefficientByWidth;
        height = realHeight / coefficientByWidth;

        if (height > maxHeight) {
          const coefficientByHeight = realHeight / maxHeight;

          width = realWidth / coefficientByHeight;
          height = realHeight / coefficientByHeight;
        }
      }

      this.setState({ width, height });
    }, this.failedToLoad);
  }

  failedToLoad = () => {
    this.setState({ failedToLoad: true });
  };

  render() {
    const { styleSheet: styles, url, style, maxWidth, maxHeight } = this.props;
    const { failedToLoad, width, height } = this.state;
    // @TODO: add spinner while image is loading
    // @TODO: add cache system like here:
    // https://github.com/vivaxy/react-native-auto-height-image/blob/master/cache.js

    return failedToLoad ? (
      <Image
        source={brokenImage}
        style={[style, styles, { width: maxWidth, height: maxHeight }]}
      />
    ) : <Image source={{ uri: url }} style={[style, { width, height }]} />;
  }
}
