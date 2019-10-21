import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import uuid from 'uuid';
import { View, Text, Button } from 'native-base';
import { get } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import ChatFooter from '../ChatFooter';
import MessageList from '../MessageList';
import UserAvatar from '../UserAvatar';
import MessageUpdateSubscription from '../MessageUpdateSubscription';

const chatMessagesEdgeFragment = gql`
  fragment Chat_messageEdge on MessageEdge {
    node {
      id
      user {
        id
      }
    }

    ...MessageList_edge
  }

  ${MessageList.fragments.edge}
`;

const connectionFragment = gql`
  fragment Chat_messages on ChatMessagesConnection {
    metaInfo {
      firstCursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      ...Chat_messageEdge
    }
  }

  ${chatMessagesEdgeFragment}
`;

const chatQuery = gql`
  query ChatMessagesQuery(
    $meId: ID!
    $chatId: ID
    $recipientId: ID
    $first: Int
    $last: Int
    $after: Cursor
    $before: Cursor
  ) {
    me {
      id
      chat(id: $chatId, recipientId: $recipientId) {
        id
        isBlocked(for: $meId)
        messages(last: $last after: $after first: $first before: $before) @connection(key: "ChatMessagesConnection") {
          ...Chat_messages
        }
        participants {
          id
          isBlocked(by: $meId)
        }
      }

      ...UserAvatar_user
    }
  }

  ${connectionFragment}
  ${UserAvatar.fragments.user}
`;

const startChatMutation = gql`
  mutation StartChatMessageMutation(
    $input: MessageInput!
    $chatId: ID
    $recipientId: ID
    $meId: ID!
  ) {
    addMessage(input: $input) {
      user {
        id
        chat(id: $chatId, recipientId: $recipientId) {
          id
          isBlocked(for: $meId)
          messages(first: 20) @connection(key: "ChatMessagesConnection") {
            ...Chat_messages
          }

          participants {
            id
            isBlocked(by: $meId)
          }
        }
      }
    }
  }

  ${connectionFragment}
`;

const createOptimisticChat = (messageEdges = []) => ({
  __typename: 'Chat',
  id: uuid(),
  isBlocked: false,
  participants: [],
  messages: {
    __typename: 'ChatMessagesConnection',
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      endCursor: '-',
    },
    metaInfo: {
      __typename: 'ConnectionMetaInfo',
      firstCursor: '-',
    },
    edges: messageEdges,
  },
});

const addMessageMutation = gql`
  mutation AddChatMessageMutation(
  $input: MessageInput!
  $after: Cursor
  $at: Cursor
  $pageCount: Int
  ) {
    addMessage(input: $input, after: $after, at: $at) {
      chat {
        id
        messages(first: $pageCount) {
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
      edge {
        ...Chat_messageEdge
      }
    }
  }

  ${chatMessagesEdgeFragment}
`;

const createOptimisticMessageEdge = (content, user, status = null) => ({
  __typename: 'MessageEdge',
  node: {
    __typename: 'Message',
    id: uuid(),
    status,
    createdAt: new Date(),
    content: {
      __typename: 'MessageContent',
      ...content,
    },
    user,
  },
});

const markMessagesAsReadMutation = gql`
  mutation MarkChatMessageAsReadMutation(
    $userId: ID!
    $input: MarkMessagesAsReadInput!
  ) {
    markMessagesAsRead(input: $input) {
      node {
        id
        status
      }

      chat {
        id
        messages(filter: {
          notReadBy: $userId
        }) {
          totalCount
        }
      }
    }
  }
`;

const messageAddSubscription = gql`
  subscription ChatMessageAddSubscription($chatId: ID!) {
    onMessageAdd(chatId: $chatId) {
      node {
        id
        user {
          id
        }
      }
      edge {
        ...Chat_messageEdge
      }
    }
  }

  ${chatMessagesEdgeFragment}
`;


@graphql(gql`query { me { id } }`, { options: { fetchPolicy: 'cache-first' } })
@graphql(chatQuery, {
  options: ({ chatId, recipientId, data: { me } }) => ({
    variables: {
      meId: me?.id,
      chatId,
      recipientId,
      first: 50,
    },
    fetchPolicy: 'cache-and-network',
  }),
})
@graphql(startChatMutation, {
  name: 'startChatMutation',
})
@graphql(addMessageMutation, {
  name: 'addMessageMutation',
})
@graphql(markMessagesAsReadMutation, {
  name: 'markMessagesAsRead',
})
@styleSheet('iola.Chat', {
  root: {
    flex: 1,
  },

  list: {
    flex: 1,
  },

  footer: {

  },

  systemMessage: {
    alignItems: 'center',
    justifyContnet: 'center',
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 16,
  },

  systemMessageText: {
    color: '#F95356',
    textAlign: 'center',
  },

  unblockButton: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
})
export default class Chat extends Component {
  getConnection() {
    const chat = get(this.props, 'data.me.chat');

    if (!chat) {
      return null;
    }

    return {
      edges: chat.messages.edges,
      hasMore: chat.messages.pageInfo.hasNextPage,
      pageInfo: chat.messages.pageInfo,
    };
  }

  async startChat(content) {
    const {
      chatId,
      recipientId,
      data: { me },
      startChatMutation,
    } = this.props;

    const variables = {
      chatId,
      meId: me.id,
      recipientId,
      input: {
        recipientIds: [recipientId],
        userId: me.id,
        content,
      },
    };

    const optimisticResponse = {
      __typename: 'Mutation',
      addMessage: {
        __typename: 'MessageCreatePayload',
        user: {
          ...me,
          chat: createOptimisticChat([
            createOptimisticMessageEdge(content, me)
          ]),
        },
      },
    };

    await startChatMutation({
      variables,
      optimisticResponse
    });

    this.startSubscriptions();
  }

  addMessage(content) {
    const {
      data: { me: user , variables: queryVariables },
      addMessageMutation,
    } = this.props;

    const chat = user.chat;
    const variables = {
      input: {
        chatId: chat.id,
        userId: user.id,
        content,
      },
      at: chat.messages.metaInfo.firstCursor,
      pageCount: chat.messages.edges.length + 1,
    };

    const optimisticResponse = {
      __typename: 'Mutation',
      addMessage: {
        __typename: 'MessageCreatePayload',
        chat,
        edge: createOptimisticMessageEdge(content, user),
      },
    };

    return addMessageMutation({
      variables,
      optimisticResponse,
      update(cache, { data: { addMessage: result } }) {

        const query = chatQuery;
        const variables = queryVariables;
        const data = cache.readQuery({ query, variables });

        cache.writeQuery({
          query,
          variables,
          data: update(data, {
            me: {
              chat: {
                messages: {
                  edges: {
                    $unshift: [result.edge]
                  },
                  pageInfo: {
                    $set: result.chat.messages.pageInfo,
                  },
                },
              },
            },
          }),
        });
      },
    });
  }

  startSubscriptions() {
    const { data: { me } } = this.props;
    const chat = get(me, 'chat');

    if (!chat) {
      return;
    }

    const variables = {
      chatId: chat.id,
    };

    /**
     * Subscribe to new messages and add them into apollo cache in `updateQuery` method
     */
    this.props.data.subscribeToMore({
      document: messageAddSubscription,
      variables,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const { onMessageAdd: payload } = subscriptionData.data;

        /**
         * Skip messages of current user
         * TODO: Check case when currently logged in user sends messages from web
         */
        if (payload.node.user.id === me.id) {
          return prev;
        }

        return update(prev, {
          me: {
            chat: {
              messages: {
                edges: {
                  $unshift: [payload.edge]
                },
              },
            },
          },
        });
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.me && this.props.data.me) {
      this.startSubscriptions();
    }
  }

  componentDidMount() {
    this.startSubscriptions();
  }

  onSend = (text) => {
    const { data: { me } } = this.props;
    const input = { text, image: null };

    if (me.chat) {
      this.addMessage(input);
    } else {
      this.startChat(input);
    }
  };

  getInterlocutorIds = () => {
    const { data: { me } } = this.props;
    const ids = me?.chat.participants
      .filter(participant => participant?.id !== me.id)
      .map(user => user?.id || null);

    /**
     * No interlocutors means user is chatting with himself.
     */
    return ids.length ? ids : [ me.id ];
  }

  getItemSide = ({ user }) => this.props.data.me.id === user?.id ? 'right' : 'left';

  onMessagesRead = (nodes) => {
    const { markMessagesAsRead, data: { me } } = this.props;
    const interlocutors = this.getInterlocutorIds();

    /**
     * Filter user own messages
     */
    const nodesToUpdate = nodes.filter(({ user }) => interlocutors.includes(user?.id));
    const messageIds = nodesToUpdate.map(node => node.id);
    if (!messageIds.length) {
      return;
    }

    const variables = {
      userId: me.id,
      input: {
        userId: me.id,
        messageIds,
      },
    };

    /**
     * TODO: Think of adding optimistic update
     */
    markMessagesAsRead({
      variables,
    });
  };

  loadMore = ({ distanceFromEnd }) => {
    const { loading, fetchMore } = this.props.data;

    if (loading) {
      return;
    }

    const { pageInfo } = this.getConnection();

    if (!pageInfo.hasNextPage) {
      return;
    }

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        first: 100,
        after: pageInfo.endCursor,
      },

      updateQuery: (prev, { fetchMoreResult: result }) => update(prev, {
        me : {
          chat: {
            messages: {
              edges: {
                $push: result.me.chat.messages.edges,
              },

              pageInfo: {
                $set: result.me.chat.messages.pageInfo,
              },
            },
          },
        },
      }),
    }).then(() => {
      this.fetchMorePromise = null;
    });
  };

  isSendBlocked = () => {
    const { data: { me, loading } } = this.props;

    if (loading || !me) return true;

    const isChatBlocked = me.chat?.isBlocked || false;

    return isChatBlocked;
  };

  renderSystemMessage = () => {
    const { styleSheet: styles, data: { me } } = this.props;

    if (!me?.chat?.isBlocked) {
      return null;
    }

    return (
      <View style={styles.systemMessage}>
        <Text style={styles.systemMessageText}>
          This user chooses not
          {'\n'}
          to interact with you
        </Text>
      </View>
    );
  };

  render() {
    const {
      style,
      styleSheet: styles,
      data: { me, loading },
      ...props
    } = this.props;

    const { hasMore = false, edges } = this.getConnection() || {};

    return (
      <View style={[styles.root, style]}>
        <MessageList
          {...props}

          edges={edges}
          loading={loading}
          loadingMore={hasMore}
          getItemSide={this.getItemSide}
          onRead={this.onMessagesRead}
          onEndReached={this.loadMore}
          inverted
          onEndReachedThreshold={2} // Two screens
          initialNumToRender={20}

          ListHeaderComponent={this.renderSystemMessage}
        />

        <ChatFooter disabled={this.isSendBlocked()} style={styles.footer} onSend={this.onSend} />
        {me && <MessageUpdateSubscription userId={me.id} />}
      </View>
    );
  }
}
