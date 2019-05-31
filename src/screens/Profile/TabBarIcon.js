import React, { Component } from 'react';
import { graphql, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import { sumBy } from 'lodash';

import { TabBarIcon as Icon } from '~components';

const userFragment = gql`
  fragment UserFriendsRequests_user on User {
    id
    friends(filter: {
      friendshipPhaseIn: [ REQUEST_RECEIVED ]
    }) {
      totalCount
    }
  }
`;

const addSubscriptionQuery = gql`
  subscription FriendRequestsAddSubscription($userId: ID!) {
    onFriendshipAdd(userId: $userId) {
      user {
        ...UserFriendsRequests_user
      }
    }
  }

  ${userFragment}
`;

const updateSubscriptionQuery = gql`
  subscription FriendRequestsUpdateSubscription($userId: ID!) {
    onFriendshipUpdate(userId: $userId) {
      user {
        ...UserFriendsRequests_user
      }

      friendship {
        id
        status
      }
    }
  }

  ${userFragment}
`;

const deleteSubscriptionQuery = gql`
  subscription FriendRequestsDeleteSubscription($userId: ID!) {
    onFriendshipDelete(userId: $userId) {
      user {
        ...UserFriendsRequests_user
      }
    }
  }

  ${userFragment}
`;

const countsQuery = gql`
  query FriendRequestsCountQuery {
    me {
      ...UserFriendsRequests_user
    }
  }

  ${userFragment}
`;

@graphql(countsQuery)
export default class TabBarIcon extends Component {
  render() {
    const { data: { me }, ...props } = this.props;
    const count = me?.friends.totalCount;
    
    return (
      <>
        <Icon {...props} count={count} name="user-bar" />
        {me && (
          <>
            <Subscription subscription={addSubscriptionQuery} variables={{ userId: me.id }} />
            <Subscription subscription={updateSubscriptionQuery} variables={{ userId: me.id }} />
            <Subscription subscription={deleteSubscriptionQuery} variables={{ userId: me.id }} />
          </>
        )}
      </>
    );
  }
}