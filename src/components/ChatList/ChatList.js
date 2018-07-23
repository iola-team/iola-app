import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, Text, Button } from 'native-base';
import { FlatList } from "react-native";

import { withStyleSheet as styleSheet } from 'theme';
import ChatListItem from '../ChatListItem'

const userFragment = gql`
  fragment ChatList_user on User {
    id
  }
`

const edgeFragment = gql`
  fragment ChatList_edge on ChatEdge {
    node {
      id
      ...ChatListItem_chat
    }
  }
  
  ${ChatListItem.fragments.chat}
`;

@styleSheet('Sparkle.ChatList', {

})
export default class ChatList extends Component {
  static fragments = {
    edge: edgeFragment,
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
    unreadCounts: PropTypes.arrayOf(PropTypes.number),
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: () => {},
    unreadCounts: [],
  };

  renderItem({ item, index }) {
    const { onItemPress, user, unreadCounts } = this.props;

    return (
      <ChatListItem
        unreadMessagesCount={unreadCounts[index]}
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

    return (
      <FlatList
        {...listProps}
        data={edges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
      />
    );
  }
}
