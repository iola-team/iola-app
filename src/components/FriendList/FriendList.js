import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
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

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
  };

  render() {
    const { edges, ...restProps } = this.props;

    return (
      <UserList {...restProps} edges={edges} />
    );
  }
}
