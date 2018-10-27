import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { filter } from 'lodash';
import { propType as fragmentProp } from 'graphql-anywhere';

import ChatList from './ChatList';

const chatsQuery = gql`
  query UnreadChatsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        chats {
          edges {
            node {
              id
              unreadMessages: messages(filter: {
                notReadBy: $userId
              }) {
                totalCount
              }

              ...ChatList_node
            }
          }
        }
      }
    }
  }
  
  ${ChatList.fragments.node}
`

const subscriptionQuery = gql`
  subscription ChatListMessageAddSubscription($userId: ID!) {
    onMessageAdd(userId: $userId) {
      chatEdge {
        node {
          id
          unreadMessages: messages(filter: {
            notReadBy: $userId
          }) {
            totalCount
          }

          ...ChatList_node
        }
      }
    }
  }
  
  ${ChatList.fragments.node}
`;

@graphql(chatsQuery, {
  options: ({ user }) => ({
    variables: {
      userId: user.id,
    },
  }),
})
export default class ChatListContainer extends Component {
  static displayName = 'Container(ChatList)';
  static fragments = {
    user: ChatList.fragments.user,
  };

  static propTypes = {
    user: fragmentProp(ChatList.fragments.user).isRequired,
  };

  componentDidMount() {
    const { data, user } = this.props;

    data.subscribeToMore({
      document: subscriptionQuery,
      variables: {
        userId: user.id,
      },

      updateQuery(prev, { subscriptionData }) {
        if (!subscriptionData.data) {
          return prev;
        }

        const { chatEdge } = subscriptionData.data.onMessageAdd;

        return update(prev, {
          user: {
            chats: {
              edges: {
                $set: [
                  chatEdge,
                  ...filter(prev.user.chats.edges, ({ node }) => node.id !== chatEdge.node.id),
                ],
              },
            },
          },
        });
      },
    });
  }

  render() {
    const { data, user, ...restProps } = this.props;

    /**
     * TODO: show pre-loader
     */
    if (data.loading) {
      return null;
    }

    const listData = data.user.chats.edges.map(({ node }) => ({
      node,
      unreadCount: node.unreadMessages.totalCount,
    }));

    return (
      <ChatList
        {...restProps}
        user={user}
        data={listData}
      />
    );
  }
}
