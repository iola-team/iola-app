import React, { Component } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Button, Text } from 'native-base';
import { noop } from 'lodash';

import { withStyle } from '~theme';
import UserListItem from '../UserListItem';

const friendshipFragment = gql`
  fragment FriendListItem_friendship on Friendship {
    id
    status
    user {
      id
    }
  }
`;

const userFragment = gql`
  fragment FriendListItem_user on User {
    id
    ...UserListItem_user
  }

  ${UserListItem.fragments.user}
`;

@withStyle('Sparkle.FriendListItem', {
  'Sparkle.UserListItem': {
    'NativeBase.ListItem': {
      'NativeBase.Right': {
        flexDirection: 'row',

        'NativeBase.Button': {
          marginLeft: 10,
          height: 43,
        },
      },
    },
  },
})
export default class FriendListItem extends Component {
  static fragments = {
    friendship: friendshipFragment,
    user: userFragment,
  };

  static propTypes = {
    friendship: fragmentProp(friendshipFragment),
    user: fragmentProp(userFragment),

    /**
     * Handlers
     */
    onAcceptPress: PropTypes.func,
    onIgnorePress: PropTypes.func,
    onCancelPress: PropTypes.func,
  };

  static defaultProps = {
    friendship: null,
    user: null,
    onAcceptPress: noop,
    onIgnorePress: noop,
    onCancelPress: noop,
  };

  render() {
    const {
      user,
      friendship,
      onAcceptPress,
      onIgnorePress,
      onCancelPress,
      ...props
    } = this.props;

    return (
      <UserListItem {...props} user={user}>
        {friendship && friendship.status === 'PENDING' && (
            friendship.user.id === user.id ? (
              <>
                <Button onPress={onAcceptPress}>
                  <Text>Accept</Text>
                </Button>

                <Button secondary bordered onPress={onIgnorePress}>
                  <Text>Ignore</Text>
                </Button>
              </>
            ) : (
              <Button secondary bordered onPress={onCancelPress}>
                <Text>Cancel</Text>
              </Button>
            )
        )}
      </UserListItem>
    );
  }
}
