import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import update from 'immutability-helper';
import uuid from 'uuid';
import { View } from 'native-base';
import { get } from 'lodash';

import { withStyleSheet as styleSheet } from 'theme';
import ChatFooter from '../ChatFooter';
import Shadow from '../Shadow';
import MessageList from '../MessageList';
import UserAvatar from '../UserAvatar';
import MessageUpdateSubscription from '../MessageUpdateSubscription';

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
      ...MessageList_edge
    }
  }

  ${MessageList.fragments.edge}
`;

const chatQuery = gql`
  query ChatMessagesQuery($chatId: ID, $recipientId: ID, $first: Int = 20 $last: Int $after: Cursor $before: Cursor) {
    me {
      id
      chat(id: $chatId, recipientId: $recipientId) {
        id
        messages(last: $last after: $after first: $first before: $before) {
          ...Chat_messages
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
  ) {
    addMessage(input: $input) {
      user {
        id
        chat(id: $chatId, recipientId: $recipientId) {
          id
          messages(first: 20) {
            ...Chat_messages
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
        ...MessageList_edge
      }
    }
  }

  ${MessageList.fragments.edge}
`;

const createOptimisticMessageEdge = (content, user) => ({
  __typename: 'MessageEdge',
  node: {
    __typename: 'Message',
    id: uuid(),
    status: null,
    createdAt: new Date(),
    content: {
      __typename: 'MessageContent',
      ...content,
    },
    user,
  },
});

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
        ...MessageList_edge
      }
    }
  }

  ${MessageList.fragments.edge}
`;

@graphql(chatQuery, {
  options: ({ chatId, recipientId }) => ({
    variables: {
      chatId,
      recipientId,
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
@styleSheet('Sparkle.Chat', {
  root: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  list: {
    flex: 1,
  },

  footer: {

  },
})
export default class Chat extends Component {
  static propTypes = {

  };

  getConnection() {
    const chat = get(this.props, 'data.me.chat');

    if (!chat) {
      return null;
    }

    return {
      edges: chat.messages.edges,
      hasMore: chat.messages.pageInfo.hasNextPage,
    };
  }

  async startChat(content) {
    const {
      recipientId,
      data: { me },
      startChatMutation,
    } = this.props;

    const variables = {
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

  onSend = async (text) => {
    const { data: { me } } = this.props;

    if (me.chat) {
      await this.addMessage({ text });
    } else {
      await this.startChat({ text });
    }
  }

  getItemSide = ({ user }) => this.props.data.me.id === user.id ? 'right' : 'left';

  render() {
    const {
      style,
      styleSheet: styles,
      children,
      data: { me },
    } = this.props;

    const {
      hasMore = false,
      edges = [],
    } = this.getConnection() || {};

    return (
      <View style={[styles.root, style]}>
        <Shadow top bottom inset style={styles.list}>
          <MessageList
            edges={edges}
            loadingMore={hasMore}
            getItemSide={this.getItemSide}
            inverted={true}
          />
        </Shadow>

        <ChatFooter style={styles.footer} onSend={this.onSend} />
        {me && <MessageUpdateSubscription userId={me.id} />}
      </View>
    );
  }
}
