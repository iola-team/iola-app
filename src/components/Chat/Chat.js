import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { NetworkStatus } from 'apollo-client';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import uuid from 'uuid';
import { View } from 'native-base';
import { get } from 'lodash';

import MessageList from '../MessageList';
import ChatFooter from '../ChatFooter';
import Shadow from '../Shadow';
import { withStyleSheet as styleSheet } from 'theme';
import UserAvatar from '../UserAvatar/UserAvatar';

const chatsWithUserQuery = gql`
  query ChatsWithUserQuery($userId: ID!) {
    me {
      id
      chats(filter: {
        withUser: $userId
      }) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const messagesQuery = gql`
  query ChatMessagesQuery($chatId: ID! $first: Int = 20 $last: Int $after: Cursor $before: Cursor) {
    me {
      id
      ...UserAvatar_user
    }

    chat: node(id: $chatId) {
      id
      ...on Chat {
        messages(last: $last after: $after first: $first before: $before) {
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
      }
    }
  }
  
  ${UserAvatar.fragments.user}
  ${MessageList.fragments.edge}
`;

const newMessageMutation = gql`
  mutation NewChatMessageMutation(
    $input: MessageInput! 
    $after: Cursor
    $at: Cursor
    $pageCount: Int
  ) {
    addMessage(input: $input, after: $after, at: $at) {
      chat {
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

const messageAddSubscription = gql`
  subscription ChatMessageAddSubscription($chatId: ID!) {
    onMessageAdd(chatId: $chatId) {
      node {
        id
      }
      edge {
        ...MessageList_edge
      }
    }
  }

  ${MessageList.fragments.edge}
`;

const messageUpdateSubscription = gql`
  subscription ChatMessageUpdateSubscription($chatId: ID!) {
    onMessageUpdate(chatId: $chatId) {
      edge {
        ...MessageList_edge
      }
    }
  }
  
  ${MessageList.fragments.edge}
`

@graphql(chatsWithUserQuery, {
  skip: props => props.chatId || !props.userId,
  options({ userId }) {
    return {
      variables: {
        userId,
      },
    };
  },
  props({ data, ownProps }) {
    return {
      ...ownProps,
      data,
      chatId: get(data, 'me.chats.edges[0].node.id'),
    };
  }
})
@graphql(messagesQuery, {
  skip: props => !props.chatId,
  props({ data, ownProps }) {
    return {
      ...ownProps,
      data: data || ownProps.data,
      loadEarlierMessages() {
        const {
          networkStatus,
          fetchMore,
          chat: {
            messages: { pageInfo }
          }
        } = data;

        if (networkStatus === NetworkStatus.fetchMore || !pageInfo.hasNextPage) {
          return;
        }

        const variables = {
          after: pageInfo.endCursor,
        };

        return fetchMore({
          variables,
          updateQuery(prev, { fetchMoreResult: { chat } }) {
            return update(prev, {
              chat: {
                messages: {
                  edges: { $push: chat.messages.edges },
                  pageInfo: { $set: chat.messages.pageInfo },
                },
              },
            });
          },
        });
      },

      /**
       * TODO: Find a better way of loading new messages instead of full reload
       */
      loadNewMessages() {
        return data.refetch();
      }
    };
  },

  options({ chatId }) {
    return {
      notifyOnNetworkStatusChange: true,
      variables: {
        chatId,
      },
    };
  }
})
@graphql(newMessageMutation, {
  props({ mutate, ownProps }) {
    return {
      ...ownProps,
      addMessage(text) {
        const chatId = ownProps.chatId;
        const { chat, me, variables: queryVariables } = ownProps.data;
        const variables = {
          input: {
            chatId,
            recipientIds: ownProps.userId && [ownProps.userId],
            userId: me.id,
            content: {
              text,
            },
          },
          at: chat && chat.messages.metaInfo.firstCursor,
          pageCount: chat && chat.messages.edges.length + 1,
        };

        const optimisticResponse = {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'MessageCreatePayload',
            chat,
            edge: {
              __typename: 'MessageEdge',
              node: {
                __typename: 'Message',
                id: uuid(),
                status: null,
                createdAt: new Date(),
                content: {
                  __typename: 'MessageContent',
                  text,
                },
                user: me,
                chat,
              },
            },
          },
        };

        return mutate({
          variables,
          optimisticResponse,
          update(cache, { data: { addMessage: result } }) {

            const query = messagesQuery;
            const variables = queryVariables;
            const data = cache.readQuery({ query, variables });

            cache.writeQuery({
              query,
              variables,
              data: update(data, {
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
              }),
            });
          }
        });
      },
    };
  },
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
    chatId: PropTypes.string,
    userId: PropTypes.string,
  };

  addSubscriptions() {
    const { chatId, data } = this.props;

    if (!chatId) {
      return;
    }

    const variables = {
      chatId,
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

        return update(prev, {
          chat: {
            messages: {
              edges: {
                $unshift: [payload.edge]
              },
            },
          },
        });
      },
    });

    /**
     * Subscribe to message updates
     * `updateQuery` is not needed here - apollo cache will automatically manage updates
     */
    this.props.data.subscribeToMore({
      document: messageUpdateSubscription,
      variables,
    });
  }

  componentDidUpdate(prev) {
    const { chatId, data } = this.props;

    if (!prev.chatId && chatId) {
      this.addSubscriptions();
    }
  }

  componentDidMount() {
    this.addSubscriptions();
  }

  getConnection() {
    const { data: { networkStatus, chat } } = this.props;

    if (!chat || networkStatus === NetworkStatus.loading) {
      return null;
    }

    return {
      edges: chat.messages.edges,
      hasMore: chat.messages.pageInfo.hasNextPage,
    };
  }

  onSend = (text) => {
    const { addMessage } = this.props;

    addMessage(text);
  };

  getItemSide = ({ user }) => this.props.data.me.id === user.id ? 'right' : 'left';

  render() {
    const {
      style,
      styleSheet: styles,
      loadEarlierMessages,
      loadNewMessages,
      addMessage,
    } = this.props;

    const {
      hasMore = false,
      edges = [],
      networkStatus = null,
    } = this.getConnection() || {};

    return (
      <View style={[styles.root, style]}>
        <Shadow top bottom inset style={styles.list}>
          <MessageList
            edges={edges}
            loadingMore={hasMore}
            getItemSide={this.getItemSide}

            inverted={true}
            initialNumToRender={15}
            onEndReachedThreshold={1}
            onEndReached={loadEarlierMessages}
            onRefresh={loadNewMessages}
            refreshing={networkStatus === NetworkStatus.refetch}
          />
        </Shadow>

        <ChatFooter style={styles.footer} onSend={this.onSend} />
      </View>
    );
  }
}
