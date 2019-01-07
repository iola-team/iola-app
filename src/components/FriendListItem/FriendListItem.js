import React, { Component, Fragment } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Button, Text, View } from 'native-base';

import { withStyle } from 'theme';
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
  };

  static defaultProps = {
    friendship: null,
    user: null,
  };

  render() {
    const { user, friendship, ...props } = this.props;

    return (
      <UserListItem {...props} user={user}>
        {friendship && friendship.status === 'PENDING' && (
          <Fragment>
            <Button>
              <Text>Accept</Text>
            </Button>

            <Button secondary>
              <Text>Ignore</Text>
            </Button>
          </Fragment>
        )}

        
      </UserListItem>
    );
  }
}
