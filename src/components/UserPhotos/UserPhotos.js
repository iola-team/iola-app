import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';

import PhotoEdit from '../PhotoEdit'; // @TODO
import ImageView from '../ImageView';
import UserPhotosCard from '../UserPhotosCard';

export default class UserPhotos extends Component {
  static fragments = {
    user: PhotoEdit.fragments.user,
  };

  static propTypes = {
    user: fragmentProp(PhotoEdit.fragments.user).isRequired,
  };

  render() {
    const { user } = this.props;
    const images = user.photos.edges.map(({ node: { url, createdAt } }) => ({
      url,
      createdAt,
    }));

    return (
      <ImageView images={images}>
        {onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
      </ImageView>
    );
  }
}
