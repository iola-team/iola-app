import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { NetworkStatus } from 'apollo-client';
import { range } from 'lodash';

import { FlatList } from '../TabNavigator';
import UserListItem from '../UserListItem';

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
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
    onItemPress: PropTypes.func,
    networkStatus: PropTypes.number,
  };

  static defaultProps = {
    onItemPress: () => {},
    networkStatus: NetworkStatus.ready,
  };

  extractItemKey = ({ node, key }) => key || node.id;
  renderItem = ({ item }) => {
    const { onItemPress } = this.props;
    const { node, opacity } = item;
    const opacityStyle = opacity && { opacity };

    return (
      <UserListItem 
        style={opacityStyle} 
        user={node}
        onPress={() => onItemPress(item)} 
      />
    );
  }

  getItemLayout = (data, index) => ({
    length: UserListItem.ITEM_HEIGHT,
    offset: UserListItem.ITEM_HEIGHT * index,
    index,
  });

  getPlaceholders() {
    return range(9).map(index => ({ 
      key: index.toString(),
      opacity: 1 - index * 0.1,
    }));
  }

  render() {
    const { edges, networkStatus, ...listProps } = this.props;
    const data = networkStatus === NetworkStatus.loading ? this.getPlaceholders() : edges;

    return (
      <FlatList
        {...listProps}
        data={data}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
        getItemLayout={this.getItemLayout}

        // Performance tweaks
        updateCellsBatchingPeriod={25}
        windowSize={41}
      />
    );
  }
}
