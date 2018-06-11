import React, { Component } from 'react';
import { isArray, isUndefined } from 'lodash';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import Picker from 'react-native-image-crop-picker';
import FetchBlob from 'react-native-fetch-blob';

import ActionSheet from '../ImagePickerActionSheet';

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

  async getImages(from, options) {
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

    const method = from === 'gallery' ? 'openPicker' : 'openCamera';
    const images = await Picker[method]({
      ...heightOptions,
      ...widthOptions,
      cropping: isUndefined(options.crop) ? this.props.crop : options.crop,
      multiple: isUndefined(options.multiple) ? this.props.multiple : options.multiple,
      mediaType: 'photo',
    });

    return isArray(images) ? images : [images];
  }

  showPicker = from => (options = {}) => this.getImages(from, options).then(async (pickedImages) => {
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
    return (
      <ActionSheet>
        {show => this.props.children(
          {
            pick: options => show({
              onSourceSelect: source => this.showPicker(source)(options),
            }),
            fromCamera: this.showPicker('camera'),
            fromGallery: this.showPicker('gallery'),
          },
          this.state.images,
          this.reset
        )}
      </ActionSheet>
    );
  }
}
