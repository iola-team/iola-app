import React, { Component } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import update from 'immutability-helper';

import { TabBarLabel } from 'components';

const userFragment = gql`
  fragment FriendsTabBarLabel_user on User {
    id
    activeFriends: friends {
      totalCount
    }
  }
`;

const meFragment = gql`
  fragment FriendsTabBarLabel_me on User {
    id
    friendRequests: friends(filter: {
      friendshipPhaseIn: [ REQUEST_RECEIVED ]
    }) {
      totalCount
    }

    ...FriendsTabBarLabel_user
  }

  ${userFragment}
`;

const createOptimisticUser = (user, { requests = 0, friends = 0 }) => update(user, {
  activeFriends: {
    totalCount: { $set: Math.max(user.activeFriends.totalCount + friends, 0) },
  },
  friendRequests: {
    totalCount: { $set: Math.max(user.friendRequests.totalCount + requests, 0) },
  },
});

export default class FriendsTabBarLabel extends Component {
  static fragments = {
    me: meFragment,
    user: userFragment,
  };

  static propTypes = {
    me: fragmentProp(meFragment),
    user: fragmentProp(userFragment),
  };

  static defaultProps = {
    me: null,
    user: null,
  };

  static createOptimisticUser = createOptimisticUser;

  render() {
    const { user, me } = this.props;
    const data = me || user;

    return (
      <TabBarLabel
        label="Friends"
        count={data?.activeFriends.totalCount}
        activeCount={data?.friendRequests?.totalCount}
      />
    );
  }
}