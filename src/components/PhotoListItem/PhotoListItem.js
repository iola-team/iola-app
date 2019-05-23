import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, StyleSheet } from "react-native";
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';

import { withStyle } from '~theme';
import Placeholder from '../Placeholder';
import Image from '../Image';
import ImageProgress from '../ImageProgress';

const photoFragment = gql`
  fragment PhotoListItem_photo on Photo {
    id
    url
  }
`;

const createOptimisticPhoto = ({ id, url }) => ({
  __typename: 'Photo',
  id: id || uniqueId('OptimisticPhoto:'),
  url
});

@withStyle('Sparkle.PhotoListItem', {
  'Sparkle.Image': {
    flex: 1,
  },

  'Sparkle.Placeholder': {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },

  overflow: 'hidden',
  borderRadius: 8,
  aspectRatio: 1,
})
export default class PhotoListItem extends Component {
  static createOptimisticPhoto = createOptimisticPhoto;
  static fragments = {
    photo: photoFragment,
  };

  static propTypes = {
    priority: PropTypes.string,
    photo: fragmentProp(photoFragment),
    progress: PropTypes.number,
  };

  static defaultProps = {
    priority: undefined,
    photo: null,
    progress: null,
  };

  state = {
    loaded: false,
  };

  onLoad = () => this.setState({ loaded: true });

  render() {
    const { photo, progress, priority, ...props } = this.props;
    const { loaded } = this.state;

    return progress === null || !photo ? (
      <View {...props}>
        {!loaded && <Placeholder isActive={!photo} />}
        {photo && <Image source={{ uri: photo.url }} priority={priority} onLoadEnd={this.onLoad} />}
      </View>
    ) : (
      <ImageProgress {...props} active progress={progress} previewUrl={photo.url} />
    );
  }
}
