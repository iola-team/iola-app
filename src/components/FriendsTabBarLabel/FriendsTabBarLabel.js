import React, { Component } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import update from 'immutability-helper';

import TabBarLabel from '../TabBarLabel';

const userFragment = gql`
  fragment FriendsTabBarLabel_user on User {
    id
    friendRequests: friends(filter: {
      friendshipPhaseIn: [ REQUEST_RECEIVED ]
    }) {
      totalCount
    }
  }
`;

const createOptimisticUser = (user, { requests = 0 }) => update(user, {
  friendRequests: {
    totalCount: { $set: Math.max(user.friendRequests.totalCount + requests, 0) },
  },
});

export default class FriendsTabBarLabel extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
  };

  static defaultProps = {
    me: null,
    user: null,
  };

  static createOptimisticUser = createOptimisticUser;

  render() {
    const { user } = this.props;
    const data = user;

    return (
      <TabBarLabel
        label="Friends"
        activeCount={data?.friendRequests?.totalCount}
      />
    );
  }
}