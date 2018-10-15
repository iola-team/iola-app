import React, { PureComponent } from 'react';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { propType as fragmentProp } from 'graphql-anywhere';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import AvatarInput from '../AvatarInput';

const userFragment = gql`
  fragment AvatarEdit_user on User {
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
  root: {
    paddingVertical: 30,
  }
})
export default class AvatarEdit extends PureComponent {
  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  static fragments = {
    user: userFragment,
  };

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
  }

  onDelete = () => {
    const { deleteAvatar, user } = this.props;

    deleteAvatar({
      variables: {
        id: user.avatar.id,
      },
    });
  }

  render() {
    const { style, styleSheet, user } = this.props;

    return (
      <View
        highlight
        horizontalPadder
        style={[styleSheet.root, style]}
      >
        <AvatarInput
          defaultValue={get(user, 'avatar.url')}
          onChange={this.onChange}
          onDelete={this.onDelete}
        />
      </View>
    );
  }
}
