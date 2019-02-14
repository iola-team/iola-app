import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from 'theme';
import ChatListItem from '../ChatListItem';
import MessageUpdateSubscription from '../MessageUpdateSubscription';
import { FlatList, NoContent } from '../TabNavigator';

const userFragment = gql`
  fragment ChatList_user on User {
    id
  }
`;

const edgeFragment = gql`
  fragment ChatList_edge on ChatEdge {
    node {
      id
      ...ChatListItem_chat
    }
  }
  
  ${ChatListItem.fragments.chat}
`;

@styleSheet('Sparkle.ChatList')
export default class ChatList extends Component {
  static fragments = {
    user: userFragment,
    edge: edgeFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
    unreadCounts: PropTypes.arrayOf(PropTypes.number),
    loading: PropTypes.bool,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    edges: [],
    loading: false,
    onItemPress: () => {},
    unreadCounts: [],
  };

  renderItem = ({ item, index }) => {
    const { onItemPress, user, unreadCounts } = this.props;
    const { node } = item;

    return (
      <ChatListItem
        unreadMessagesCount={unreadCounts[index]}
        currentUserId={user?.id}
        chat={node}
        onPress={() => onItemPress(item)}
      />
    );
  }

  getPlaceholders = () => range(3).map(index => ({
    key: index.toString(),
  }));

  extractItemKey = ({ node, key }) => key || node.id;

  render() {
    const { edges, loading, user, ...listProps } = this.props;
    const listData = loading && !edges.length ? this.getPlaceholders() : edges;

    return (
      <>
        <FlatList
          {...listProps}
          data={listData}
          keyExtractor={this.extractItemKey}
          renderItem={this.renderItem}
          ListEmptyComponent={<NoContent text="You have no chats" icon="chats-empty-state" />}
        />

        {user && <MessageUpdateSubscription userId={user.id} />}
      </>
    );
  }
}
