import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import ChatList from './ChatList';

const meQuery = gql`
  query {
    user: me {
      id
      
      ...ChatList_user
    }
  }
  
  ${ChatList.fragments.user}
`;

const unreadChats = gql`
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
            }

            ...ChatList_edge
          }
        }
      }
    }
  }
  
  ${ChatList.fragments.edge}
`

const subscriptionQuery = gql`
  subscription($userId: ID!) {
    onMessageAdd(userId: $userId) {
      chat {
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
  
  ${ChatList.fragments.node}
`

@graphql(meQuery, { name: 'me' })
@graphql(unreadChats, {
  skip: ({ me }) => me.loading,
  options: ({ me: { user } }) => ({
    variables: {
      userId: user.id,
    },
  }),
})
export default class extends Component {
  static displayName = 'Container(ChatList)';

  componentDidUpdate(prev) {
    const { data, me } = this.props;

    !prev.data && data && data.subscribeToMore({
      document: subscriptionQuery,
      variables: {
        userId: me.user.id,
      },

      updateQuery(prev, { subscriptionData }) {
        console.log(subscriptionData);
      },
    });
  }

  render() {
    const { data, me } = this.props;

    if (me.loading) {
      return null;
    }

    /**
     * TODO: show pre-loader
     */
    if (data.loading) {
      return null;
    }

    const edges = data.user.chats.edges;

    /**
     * TODO: Think about a better way of passing counts to the list
     */
    const unreadCountsMap = edges.reduce((counts, { node }) => {
      counts[node.id] = node.unreadMessages.totalCount;

      return counts;
    }, {});

    return (
      <ChatList
        user={me.user}
        edges={edges}
        unreadCounts={unreadCountsMap}
      />
    );
  }
}
