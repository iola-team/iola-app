import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import UserList from '../UserList';
import FriendListItem from '../FriendListItem';

const edgeFragment = gql`
  fragment FriendList_edge on UserFriendEdge {
    ...UserList_edge

    friendship {
      id
      status
      user {
        id
      }
    }
  }
  
  ${UserList.fragments.edge}
`;

export default class FriendList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  renderItem = ({ item }) => {
    const { node, friendship } = item;

    return <FriendListItem user={node} friendship={friendship} />;
  };

  render() {
    const { ...props } = this.props;
    
    return <UserList {...props} renderItem={this.renderItem} />;
  }
}