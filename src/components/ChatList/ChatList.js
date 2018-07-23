import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, Text, Button } from 'native-base';
import { FlatList } from "react-native";
import { orderBy } from 'lodash';

import { withStyleSheet as styleSheet } from 'theme';
import ChatListItem from '../ChatListItem'

const userFragment = gql`
  fragment ChatList_user on User {
    id
  }
`

const nodeFragment = gql`
  fragment ChatList_node on Chat {
    id
    messages(last: 1) {
      edges {
        node {
          id
          createdAt
        }
      }
    }

    ...ChatListItem_chat
  }
  
  ${ChatListItem.fragments.chat}
`

const edgeFragment = gql`
  fragment ChatList_edge on ChatEdge {
    node {
      ...ChatList_node
    }
  }
  
  ${nodeFragment}
`;

@styleSheet('Sparkle.ChatList', {

})
export default class ChatList extends Component {
  static fragments = {
    edge: edgeFragment,
    user: userFragment,
    node: nodeFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
    unreadCounts: PropTypes.object,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: () => {},
    unreadCounts: {},
  };

  renderItem({ item }) {
    const { onItemPress, user, unreadCounts } = this.props;

    return (
      <ChatListItem
        unreadMessagesCount={unreadCounts[item.node.id]}
        currentUserId={user.id}
        chat={item.node}
        onPress={() => onItemPress(item)}
      />
    );
  }

  extractItemKey({ node }) {
    return node.id;
  }

  render() {
    const { edges, ...listProps } = this.props;

    /**
     * TODO: Get rid of client side reordering - may lead to data inconsistency
     */
    const orderedEdges = orderBy(edges,
      'node.messages.edges[0].node.createdAt',
      'desc',
    );

    return (
      <FlatList
        {...listProps}
        data={orderedEdges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
      />
    );
  }
}
