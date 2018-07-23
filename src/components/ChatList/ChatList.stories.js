import React from 'react';
import { find, filter, range, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { button, number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import moment from 'moment'
import uuid from 'uuid/v4'
import { PubSub } from 'graphql-subscriptions';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ChatList from './ChatList';
import ChatListContainer from './index';

const stories = storiesOf('Components/ChatList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const subscriptions = new PubSub();
const users = [
  {
    id: 'User:1',
    name: 'Roman Banan',
    avatar: {
      id: 'Avatar:1',
      url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
    },
  },

  {
    id: 'User:2',
    name: 'Grey Rabbit',
    avatar: {
      id: 'Avatar:2',
      url: 'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png',
    },
  },

  {
    id: 'User:3',
    name: 'Jk KK',
    avatar: {
      id: 'Avatar:3',
      url: 'https://avatarfiles.alphacoders.com/458/45801.jpg',
    },
  },

  {
    id: 'User:4',
    name: 'Brad Pitt',
    avatar: {
      id: 'Avatar:4',
      url: 'https://pbs.twimg.com/profile_images/631273849435230208/LSWD16F9_400x400.jpg',
    },
  },
];

const chats = [
  {
    id: 'Chat:1',
    user: find(users, { id: 'User:1' }),
    participants: [
      find(users, { id: 'User:1' }),
      find(users, { id: 'User:2' }),
    ],
  },
  {
    id: 'Chat:2',
    user: find(users, { id: 'User:1' }),
    participants: [
      find(users, { id: 'User:1' }),
      find(users, { id: 'User:3' }),
    ],
  },

  {
    id: 'Chat:3',
    user: find(users, { id: 'User:1' }),
    participants: [
      find(users, { id: 'User:1' }),
      find(users, { id: 'User:4' }),
    ],
  },
];

const messages = [
  {
    id: `Message:1`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:1' }),
    chat: find(chats, { id: 'Chat:1' }),
  },

  {
    id: `Message:2`,
    status: 'READ',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:2' }),
    chat: find(chats, { id: 'Chat:2' }),
  },

  {
    id: `Message:3`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:1' }),
    chat: find(chats, { id: 'Chat:3' }),
  },

  {
    id: `Message:4`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:3' }),
    chat: find(chats, { id: 'Chat:3' }),
  },
];

const dataStore = {
  users,
  chats,
  messages,
};

const typeDefs = gql`
  scalar Date
  scalar Cursor

  type Query {
    me: User
    node(id: ID!): Node!
  }

  type Subscription {
    onMessageAdd(chatId: ID, userId: ID): MessageSubscriptionPayload!
  }

  type MessageSubscriptionPayload {
    user: User!
    chat: Chat!
    node: Message!
    edge: MessageEdge!
  }

  type Avatar {
    id: ID!
    url: String!
  }

  interface Node {
    id: ID!
  }
  
  type User implements Node {
    id: ID!
    name: String!
    avatar: Avatar
    chats(first: Int, after: Cursor, last: Int, before: Cursor): UserChatsConnection!
  }

  type ConnectionMetaInfo {
    firstCursor: Cursor!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  input ChatMessagesFilterInput {
    notReadBy: ID
  }
  
  type Chat {
    id: ID!
    user: User!
    participants: [User!]!
    messages(filter: ChatMessagesFilterInput, first: Int, after: Cursor, last: Int, before: Cursor): ChatMessagesConnection!
  }

  type ChatEdge {
    node: Chat!
    cursor: Cursor!
  }

  type UserChatsConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [ChatEdge!]!
    totalCount: Int
  }

  type MessageContent {
    text: String
  }

  enum MessageStatus {
    DELIVERED
    READ
  }

  type Message {
    id: ID!
    status: MessageStatus
    user: User!
    chat: Chat!
    content: MessageContent
    createdAt: Date!
  }

  type MessageEdge {
    node: Message!
    cursor: Cursor!
  }

  type ChatMessagesConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [MessageEdge!]!
    totalCount: Int
  }
`;

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, {id: 'User:1'}),
    node: (root, { id }, { dataStore: { users } }) => find(users, { id }),
  },

  Subscription: {
    onMessageAdd: {
      resolve: ({ content, userId, chatId }, args, { dataStore }) => {
        const user = find(dataStore.users, { id: args.userId });
        const messageUser = find(dataStore.users, { id: userId });
        const chat = find(dataStore.chats, { id: chatId });
        const node = {
          id: uuid(),
          content,
          status: 'DELIVERED',
          createdAt: new Date(),
          user: messageUser,
          chat,
        }

        dataStore.messages.unshift(node);

        const cursor = "first";

        return {
          node,
          chat,
          user,
          edge: {
            cursor,
            node,
          }
        };
      },
      subscribe: () => {
        console.log('Subscrive');

        return subscriptions.asyncIterator('onMessageAdd');
      }
    },
  },

  User: {
    async chats(user, args, { dataStore: { chats, messages } }) {
      const userChats = filter(chats, ['user.id', user.id]);
      const orderedChats = orderBy(userChats, [({ id }) => {
        const chatMessages = filter(messages, ['chat.id', id]);
        const orderedMessages = orderBy(chatMessages, ['createdAt', 'desc']);

        return orderedMessages[0].createdAt;
      }, 'desc'])

      return createConnection(orderedChats, args);
    }
  },

  Chat: {
    async messages(chat, args, { dataStore: { messages } }) {
      const { notReadBy } = args.filter || {};
      let allChatMessages = filter(messages, ['chat.id', chat.id]);

      if (notReadBy) {
        allChatMessages = filter(allChatMessages, ({ status, user }) => (
          status === 'DELIVERED' && user.id !== notReadBy
        ));
      }

      const chatMessages = orderBy(
        allChatMessages,
        'createdAt',
        'asc'
      );

      return createConnection(chatMessages, args);
    }
  },

  Node: {
    __resolveType: ({ id }) => {
      const [type] = id.split(':');

      return type;
    }
  }
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const userQuery = gql`
  query($userId: ID!) {
    user: node(id: $userId) {
      id
      ...ChatList_user
      ...on User {
        allChats: chats {
          edges {
            node {
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
  ${ChatList.fragments.user}
`;

// Stories
stories.add('Static list', () => {
  return (
    <Query query={userQuery} variables={{ userId: 'User:1' }}>
      {({ data, loading }) => {
        if (loading) {
          return null;
        }

        const edges = data.user.allChats.edges;
        const unreadCountList = edges.map(({ node }) => node.unreadMessages.totalCount);

        return (
          <ChatList
            user={data.user}
            edges={data.user.allChats.edges}
            unreadCounts={unreadCountList}
          />
        );
      }}
    </Query>
  );
});


stories.add('Container', () => {
  button('Message from Brad', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:4',
    chatId: 'Chat:3',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  button('Message from JK', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:3',
    chatId: 'Chat:2',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  button('Message from Grey', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:2',
    chatId: 'Chat:1',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  return (
    <ChatListContainer />
  );
});
