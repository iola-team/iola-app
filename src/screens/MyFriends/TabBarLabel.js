import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';

import { TabBarLabel } from 'components';

const userFragment = gql`
  fragment MyFriendsTabBarLabel on User {
    id
    activeFriends: friends {
      totalCount
    }
    friendRequests: friends(filter: {
      friendshipPhaseIn: [ REQUEST_RECEIVED ]
    }) {
      totalCount
    }
  }
`;

const createOptimisticUser = (user, { requests = 0, friends = 0 }) => update(user, {
  activeFriends: {
    totalCount: { $set: Math.max(user.activeFriends.totalCount + friends, 0) },
  },
  friendRequests: {
    totalCount: { $set: Math.max(user.friendRequests.totalCount + requests, 0) },
  },
});

@graphql(gql`
  query MyFriendsCountQuery {
    me {
      id
      ...MyFriendsTabBarLabel
    }
  }

  ${userFragment}
`)
export default class MyFriendsTabBarLabel extends Component {
  static fragments = {
    user: userFragment
  };

  static createOptimisticUser = createOptimisticUser;

  render() {
    const { data: { loading, me } } = this.props;

    return (
      <TabBarLabel
        label="Friends"
        count={me?.activeFriends.totalCount}
        activeCount={me?.friendRequests.totalCount}
      />
    );
  }
}