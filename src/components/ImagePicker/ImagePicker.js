import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import Picker from 'react-native-image-crop-picker';
import FetchBlob from 'react-native-fetch-blob'

export default class ImagePicker extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    crop: PropTypes.bool,

    onChange: PropTypes.func,
  }

  static defaultProps = {
    crop: false,
    onChange: () => {},
  }

  state = {
    images: [],
  };

  async getImage(options) {
    return await Picker.openPicker({
      width: options.width || this.props.width,
      height: options.height || this.props.height,
      cropping: options.crop || this.props.crop,
      mediaType: 'photo',
    });
  }

  showPicker = (options = {}) => this.getImage(options).then(async (image) => {
    const blob = await File.build(
      image.path.split('/').pop(),
      FetchBlob.wrap(image.path),
      image.mime,
    );

    const images = [{
      ...image,
      blob,
    }];

    this.setState({ images });
    this.props.onChange(images);

    return image;
  }).catch(() => null);

  reset = () => {
    this.setState({ images: [] });
  };

  render() {
    return this.props.children(
      this.showPicker,
      this.state.images,
      this.reset
    );
  }
}
