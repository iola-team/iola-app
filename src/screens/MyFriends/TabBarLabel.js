import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { TabBarLabel } from 'components';

@graphql(gql`
  query MyPhotosCountQuery {
    me {
      id
      activeFriends: friends @connection(key: "MyFriends") {
        totalCount
      }
      friendRequests: friends(filter: {
        friendshipPhaseIn: [ REQUEST_RECEIVED ]
      }) {
        totalCount
      }
    }
  }
`)
export default class MyFriendsTabBarLabel extends Component {
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