import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FetchBlob from 'react-native-fetch-blob';
import { Alert } from 'react-native';

import AvatarToolbar from './AvatarToolbar';
import ImagePicker from '../ImagePicker';

const userFragment = gql`
  fragment AvatarToolbar_user on User {
    id
    avatar {
      id
      url
      medium: url(size: MEDIUM)
    }
  }
`;

const addAvatarMutation = gql`
  mutation addUserAvatarMutation($userId: ID!, $file: Upload!) {
    addUserAvatar(userId: $userId, file: $file) {
      user {
        ...AvatarToolbar_user
      }
    }
  }

  ${userFragment}
`;

const deleteAvatarMutation = gql`
  mutation deleteUserAvatarMutation($id: ID!) {
    deleteUserAvatar(id: $id) {
      user {
        ...AvatarToolbar_user
      }
    }
  }

  ${userFragment}
`;

@graphql(addAvatarMutation, {
  name: 'addAvatarMutation'
})
@graphql(deleteAvatarMutation, {
  name: 'deleteAvatarMutation',
  options({ user }) {
    return {
      optimisticResponse: {
        deleteUserAvatar: {
          __typename: 'Mutation',
          user: {
            __typename: 'User',
            id: user.id,
            avatar: null,
          },
        },
      },
    };
  }
})
export default class AvatarToolbarContainer extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  onAvatarChange([{ blob }]) {
    const { user, addAvatarMutation } = this.props;

    addAvatarMutation({
      variables: {
        userId: user.id,
        file: blob,
      }
    });
  }

  onAvatarDelete(reset) {
    const { user, deleteAvatarMutation } = this.props;

    deleteAvatarMutation({
      variables: {
        id: user.avatar.id,
      },
    });

    reset();
  }

  onToolbarAction = (pick, reset) => (action) => {
    if (action === 'delete') {
      Alert.alert(
        'Are you sure?',
        'This action cannot be undone!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => this.onAvatarDelete(reset), style: 'destructive' },
        ],
        {
          cancelable: false
        },
      );
    } else {
      pick();
    }
  }

  render() {
    const { user } = this.props;
    const avatarUrl = get(user, 'avatar.url');

    return (
      <ImagePicker
        crop
        width={500}
        height={500}
        onChange={::this.onAvatarChange}
      >
        {(pick, [{ path } = {}], reset) => (
          <AvatarToolbar
            imageUrl={path || avatarUrl}
            onButtonPress={this.onToolbarAction(pick, reset)}
          />
        )}
      </ImagePicker>
    );
  }
}
