import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FetchBlob from 'react-native-fetch-blob';

import AvatarToolbar from './AvatarToolbar';
import ImagePicker from '../ImagePicker';

const userFragment = gql`
  fragment AvatarToolbar_user on User {
    id
    avatar {
      id
      url
    }
  }
`;

const addAvatarMutation = gql`
  mutation addUserAvatarMutation($userId: ID!, $file: Upload!) {
    addUserAvatar(userId: $userId, file: $file) {
      id
      url
      medium: url(size: MEDIUM)
    }
  }
`;

@graphql(addAvatarMutation, {
  props: ({ mutate, ownProps: { user } }) => ({
    addAvatar(userId, file) {
      return mutate({
        variables: {
          userId,
          file,
        }
      });
    },
  }),
})
export default class AvatarToolbarContainer extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  onAvatarChange([{ blob }]) {
    const { user, addAvatar } = this.props;

    addAvatar(user.id, blob);
  }

  onToolbarAction = pick => action => {
    if (action === 'delete') {
      // Skip for now ...

      return;
    }

    pick();
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
        {(pick, [{ path } = {}]) => (
          <AvatarToolbar
            imageUrl={path || avatarUrl}
            onButtonPress={this.onToolbarAction(pick)}
          />
        )}
      </ImagePicker>
    );
  }
}
