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
`;

const nodeFragment = gql`
  fragment ChatList_node on Chat {
    id
    messages(first: 1) {
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
`;

@styleSheet('Sparkle.ChatList', {

})
export default class ChatList extends Component {
  static fragments = {
    user: userFragment,
    node: nodeFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        unreadCount: PropTypes.number,
        node: fragmentProp(nodeFragment).isRequired,
      }),
    ),
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: () => {},
    unreadCounts: {},
  };

  renderItem({ item }) {
    const { onItemPress, user } = this.props;

    return (
      <ChatListItem
        unreadMessagesCount={item.unreadCount}
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
    const { data, ...listProps } = this.props;

    return (
      <FlatList
        {...listProps}
        data={data}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
      />
    );
  }
}
