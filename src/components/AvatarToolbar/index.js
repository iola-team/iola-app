import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-crop-picker';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FetchBlob from 'react-native-fetch-blob';

import AvatarToolbar from './AvatarToolbar';

@graphql(gql`
  mutation addUserAvatarMutation($userId: ID!, $file: Upload!) {
    addUserAvatar(userId: $userId, file: $file) {
      id
      user {
        id
        ...AvatarToolbar_user
      }
    }
  }
  
  ${AvatarToolbar.fragments.user}
`, {
  props: ({ mutate }) => ({
    addAvatar(userId, file, uploadProgress) {
      return mutate({
        variables: {
          userId,
          file,
        },
        context: {
          fetchOptions: {
            uploadProgress,
          },
        }
      });
    }
  }),
})
export default class AvatarToolbarContainer extends Component {
  static fragments = AvatarToolbar.fragments;
  static propTypes = {
    user: PropTypes.object,
  };

  async getImage() {
    try {
      return await ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: false,
        mediaType: 'photo',
      });
    } catch(e) {
      return null;
    }
  }

  async onButtonPress(action) {
    const { addAvatar, user } = this.props;

    if (action === 'add' || action === 'change') {
      const image = await this.getImage();
      const { path, mime } = image;

      const file = await File.build(
        'avatar.jpg',
        FetchBlob.wrap(path),
        mime,
      );

      const avatar = await addAvatar(user.id, file);
    }
  }

  render() {
    const { user } = this.props;

    return (
      <AvatarToolbar user={user} onButtonPress={::this.onButtonPress} />
    );
  }
}
