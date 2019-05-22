import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import UserAvatar from '../UserAvatar';
import AvatarInput from '../AvatarInput';

const userFragment = gql`
  fragment AvatarEdit_user on User {
    id
    avatar {
      id
      url
    }

    ...UserAvatar_user
  }

  ${UserAvatar.fragments.user}
`;

const addAvatarMutation = gql`
  mutation addUserAvatarMutation($userId: ID!, $file: Upload!) {
    addUserAvatar(userId: $userId, file: $file) {
      user {
        ...AvatarEdit_user
      }
    }
  }

  ${userFragment}
`;

const deleteAvatarMutation = gql`
  mutation deleteUserAvatarMutation($id: ID!) {
    deleteUserAvatar(id: $id) {
      user {
        ...AvatarEdit_user
      }
    }
  }

  ${userFragment}
`;

@graphql(addAvatarMutation, {
  name: 'addAvatar',
})
@graphql(deleteAvatarMutation, {
  name: 'deleteAvatar',
})
@styleSheet('Sparkle.AvatarEdit', {
  root: {}
})
export default class AvatarEdit extends PureComponent {
  static HEIGHT = 140;

  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    user: null,
    loading: false,
  }

  onChange = (image) => {
    if (!image) {
      return;
    }

    const { addAvatar, user } = this.props;

    addAvatar({
      variables: {
        userId: user.id,
        file: image.blob,
      },
    });
  };

  onDelete = () => {
    const { deleteAvatar, user } = this.props;

    deleteAvatar({
      variables: {
        id: user.avatar.id,
      },
    });
  };

  render() {
    const { style, styleSheet, user, loading } = this.props;
    const avatarUrl = user?.avatar === null ? null : user?.avatar?.url;

    return (
      <View
        horizontalPadder
        style={[styleSheet.root, style]}
      >
        <AvatarInput
          defaultValue={avatarUrl}
          loading={loading}
          onChange={this.onChange}
          onDelete={this.onDelete}
        />
      </View>
    );
  }
}
