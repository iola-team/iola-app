import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, StyleSheet } from "react-native";

import { withStyle } from 'theme';
import Placeholder from '../Placeholder';
import Image from '../Image';

const photoFragment = gql`
  fragment PhotoListItem_photo on Photo {
    id
    url
  }
`;

@withStyle('Sparkle.PhotoListItem', {
  'Sparkle.Image': {
    flex: 1,
  },

  aspectRatio: 1,
  borderRadius: 8,
  backgroundColor: '#F8F9FB',
})
export default class PhotoListItem extends Component {
  static fragments = {
    photo: photoFragment,
  };

  static propTypes = {
    photo: fragmentProp(photoFragment),
  };

  static defaultProps = {
    photo: null,
  };

  state = {
    loaded: false,
  };

  onLoad = () => this.setState({ loaded: true });

  render() {
    const { photo, ...props } = this.props;
    const { loaded } = this.state;

    return (
      <View {...props}>
        <Placeholder style={StyleSheet.absoluteFill} isActive={!loaded} />
        {photo && (
          <Image source={{ uri: photo.url }} onLoadEnd={this.onLoad} />
        )}
      </View>
    );
  }
}
