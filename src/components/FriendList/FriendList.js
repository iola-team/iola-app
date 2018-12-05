import React, { Component } from 'react';
import gql from 'graphql-tag';

import UserList from '../UserList';

const edgeFragment = gql`
  fragment FriendList_edge on UserEdge {
    ...UserList_edge
  }
  
  ${UserList.fragments.edge}
`;

export default class FriendList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  render() {
    return <UserList {...this.props} />;
  }
}
