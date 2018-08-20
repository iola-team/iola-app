import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from "react-native";
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

import UserListItem from '../UserListItem'

const edgeFragment = gql`
  fragment UserList_edge on UserEdge {
    cursor
    node {
      id
      ...UserListItem_user
    }
  }
  
  ${UserListItem.fragments.user}
`;

export default class UserList extends Component {
  static propTypes = {
    onItemPress: PropTypes.func,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static fragments = {
    edge: edgeFragment,
  };

  renderItem({ item }) {
    const { onItemPress } = this.props;

    return (
      <UserListItem user={item.node} onPress={() => onItemPress(item)} />
    );
  }

  extractItemKey({ node }) {
    return node.id;
  }

  getItemLayout(data, index) {

    return {
      length: UserListItem.ITEM_HEIGHT,
      offset: UserListItem.ITEM_HEIGHT * index,
      index,
    }
  }

  render() {
    const { edges, forwardedRef, ...listProps } = this.props;

    return (
      <FlatList
        {...listProps}
        data={edges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
        getItemLayout={::this.getItemLayout}

        // Performance tweaks
        updateCellsBatchingPeriod={25}
        windowSize={41}
      />
    );
  }
}
