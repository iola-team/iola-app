import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { noop } from 'lodash';

import { withStyle } from '~theme';
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

@withStyle('Sparkle.FriendList')
export default class FriendList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),

    /**
     * Handlers
     */
    onItemPress: PropTypes.func,
    onAcceptPress: PropTypes.func,
    onIgnorePress: PropTypes.func,
    onCancelPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: noop,
    onAcceptPress: noop,
    onIgnorePress: noop,
    onCancelPress: noop,
  };

  renderItem = ({ item, index }) => {
    const { edges, onItemPress, onAcceptPress, onIgnorePress, onCancelPress } = this.props;
    const { node, friendship } = item;

    return (
      <FriendListItem
        user={node}
        friendship={friendship}
        last={(index + 1) === edges?.length}
        onPress={() => onItemPress(item)}
        onAcceptPress={() => onAcceptPress(item)}
        onIgnorePress={() => onIgnorePress(item)}
        onCancelPress={() => onCancelPress(item)}
      />
    );
  };

  render() {
    const { ...props } = this.props;

    return <UserList {...props} renderItem={this.renderItem} />;
  }
}