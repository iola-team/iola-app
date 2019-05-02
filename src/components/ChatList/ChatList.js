import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import ChatListItem from '../ChatListItem';
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
    noContentText: PropTypes.string,
    noContentStyle: PropTypes.object,
  };

  static defaultProps = {
    user: null,
    edges: null,
    loading: false,
    onItemPress: () => {},
    unreadCounts: [],
    noContentText: undefined,
    noContentStyle: undefined,
  };

  renderItem = ({ item, index }) => {
    const { onItemPress, user, unreadCounts, edges } = this.props;
    const { node } = item;

    return (
      <ChatListItem
        last={(index + 1) === edges?.length}
        unreadMessagesCount={unreadCounts[index]}
        currentUserId={user?.id}
        chat={node}
        onPress={() => onItemPress(item)}
      />
    );
  }

  getPlaceholders = count => range(count).map(index => ({
    key: index.toString(),
  }));

  extractItemKey = ({ node, key }) => key || node.id;

  render() {
    const { edges, loading, user, noContentText, noContentStyle, ...listProps } = this.props;
    const isLoaded = edges !== null;
    const data = !isLoaded && loading ? this.getPlaceholders(3) : edges;

    return (
      <FlatList
        ListEmptyComponent={(
          <NoContent 
            style={noContentStyle}
            icon="chats-empty-state"
            text={noContentText === undefined ? 'No chats' : noContentText}
          />
        )}

        {...listProps}
        data={data}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
      />
    );
  }
}
