import React, { Component } from 'react';
import { isArray, isUndefined } from 'lodash';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import Picker from 'react-native-image-crop-picker';
import FetchBlob from 'react-native-fetch-blob'

export default class ImagePicker extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    crop: PropTypes.bool,
    multiple: PropTypes.bool,

    onChange: PropTypes.func,
  }

  static defaultProps = {
    width: null,
    height: null,
    crop: false,
    multiple: false,
    onChange: () => {},
  }

  state = {
    images: [],
  };

  async getImages(options) {
    const width = options.width || this.props.width;
    const height = options.height || this.props.height;

    const heightOptions = height ? {
      height,
      compressImageMaxHeight: height,
    } : {};

    const widthOptions = width ? {
      width,
      compressImageMaxWidth: width,
    } : {};

    const images = await Picker.openPicker({
      ...heightOptions,
      ...widthOptions,
      cropping: isUndefined(options.crop) ? this.props.crop : options.crop,
      multiple: isUndefined(options.multiple) ? this.props.multiple : options.multiple,
      mediaType: 'photo',
    });

    return isArray(images) ? images : [images];
  }

  showPicker = (options = {}) => this.getImages(options).then(async (pickedImages) => {
    const images = await Promise.all(pickedImages.map(async (image) => {
      const blob = await File.build(
        image.path.split('/').pop(),
        FetchBlob.wrap(image.path),
        image.mime,
      );

      return {
        ...image,
        blob,
      }
    }));

    this.setState({ images });
    this.props.onChange(images);

    return images;
  }).catch(() => null);

  reset = async () => {
    this.setState({ images: [] });
    this.props.onChange([]);

    return [];
  };

  render() {
    return this.props.children(
      this.showPicker,
      this.state.images,
      this.reset
    );
  }
}
