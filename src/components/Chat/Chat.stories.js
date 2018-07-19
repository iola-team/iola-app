import React from 'react';
import { find, filter, uniqueId, range, orderBy } from 'lodash';
import gql from 'graphql-tag';
import { button, number, withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import { cursorToOffset, offsetToCursor } from 'graphql-relay';
import delay from 'promise-delay';
import uuid from 'uuid/v4';
import moment from 'moment'
import { PubSub } from 'graphql-subscriptions';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import Chat from './Chat';

const stories = storiesOf('Components/Chat', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({
  backgroundColor: '#F8F9FB',
}));

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
      find(users, { id: 'User:2' }),
    ],
  },

  {
    id: 'Chat:3',
    user: find(users, { id: 'User:1' }),
    participants: [
      find(users, { id: 'User:1' }),
      find(users, { id: 'User:2' }),
    ],
  },
];

const unOrderedFakeMessages = range(100).map((index) => ({
  id: `Message:${index + 1}`,
  content: {
    text: faker.hacker.phrase(),
  },
  status: 'READ',
  createdAt: faker.date.recent(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:1' }).participants),
  chat: find(chats, { id: 'Chat:1' }),
}));

const orderedNumMessages = range(300).map((index) => {
  return {
    id: `Message:${unOrderedFakeMessages.length + index}`,
    content: {
      text: (index + 1).toString(),
    },
    status: 'READ',
    createdAt: moment().subtract(1, 'months').add(index, 'h').toDate(),
    user: faker.random.arrayElement(find(chats, { id: 'Chat:2' }).participants),
    chat: find(chats, { id: 'Chat:2' }),
  };
});

const messages = [
  ...unOrderedFakeMessages,
  ...orderedNumMessages,
];

const dataStore = {
  users,
  chats,
  messages,
};

const typeDefs = gql`
  scalar Date
  scalar Cursor
  
  type Subscription {
    onMessageAdd(chatId: ID!): MessageSubscriptionPayload!
    onMessageUpdate(chatId: ID!): MessageSubscriptionPayload!
  }
  
  type Mutation {
    addMessage(input: MessageInput!, after: Cursor, before: Cursor, at: Cursor): MessageCreatePayload!
  }
  
  type Query {
    me: User
    node(id: ID!): Node!
  }

  interface Node {
    id: ID!
  }

  type Avatar {
    id: ID!
    url: String!
  }
  
  type User implements Node {
    id: ID!
    name: String!
    avatar: Avatar
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

  type Chat implements Node {
    id: ID!
    user: User!
    participants: [User!]!
    messages(first: Int, after: Cursor, last: Int, before: Cursor): ChatMessagesConnection!
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
    content: MessageContent
    createdAt: Date!
    user: User!
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

  input MessageContentInput {
    text: String,
  }

  input MessageInput {
    userId: ID!
    chatId: ID!
    content: MessageContentInput!
  }

  type MessageSubscriptionPayload {
    user: User!
    chat: Chat!
    node: Message!
    edge: MessageEdge!
  }
  
  type MessageCreatePayload {
    user: User!
    chat: Chat!
    node: Message!
    edge: MessageEdge!
  }
`;

const createTempMessage = text => ({
  id: uuid(),
  createdAt: new Date(),
});

const resolvers = {
  Subscription: {
    onMessageAdd: {
      resolve: ({ content, userId, chatId }, args, { dataStore }) => {
        const user = find(dataStore.users, { id: userId });
        const chat = find(dataStore.chats, { id: chatId });
        const node = {
          id: uuid(),
          content,
          status: 'READ',
          createdAt: new Date(),
          user,
          chat,
        }

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
      subscribe: () => subscriptions.asyncIterator('onMessageAdd'),
    },

    onMessageUpdate: {
      resolve: ({ content, messageId }, args, { dataStore }) => {
        const node = find(dataStore.messages, { id: messageId });
        const cursor = "first";

        return {
          node,
          chat: node.chat,
          user: node.user,
          edge: {
            cursor,
            node,
          }
        };
      },

      subscribe: () => subscriptions.asyncIterator('onMessageUpdate'),
    },
  },

  Mutation: {
    async addMessage(root, args, { dataStore }) {
      const { input, at, after, before } = args;
      const { messages, users, chats } = dataStore;

      const user = find(users, { id: input.userId });
      const chat = find(chats, { id: input.chatId });
      const node = {
        id: `Message:${messages.length}`,
        content: {
          ...input.content,
        },
        status: 'DELIVERED',
        createdAt: new Date(),
        user,
        chat,
      };

      messages.push(node);

      let cursor = at || offsetToCursor(0);

      if (before) {
        cursor = offsetToCursor(Math.max(cursorToOffset(before) - 1, 0));
      }

      if (after) {
        cursor = offsetToCursor(cursorToOffset(before) + 1);
      }

      await delay(1000);

      /**
       * Emit message update subscription after 2 seconds
       */
      setTimeout(() => {
        node.status = 'READ';

        subscriptions.publish('onMessageUpdate', {
          messageId: node.id,
        });
      }, 2000);

      return {
        node,
        user,
        chat,
        edge: {
          cursor,
          node,
        },
      };
    }
  },

  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, {id: 'User:1'}),
    node: (root, { id }, { dataStore: { users, chats } }) => {
      const [type] = id.split(':');
      const nodes = type === 'User' ? users : chats;

      return find(nodes, { id });
    },
  },

  Chat: {
    async messages(chat, args, { dataStore: { messages } }) {
      await delay(1000);
      const chatMessages = orderBy(
        filter(messages, ['chat.id', chat.id]),
        'createdAt',
        'desc'
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

// Stories
stories.add('Fake messages', () => {
  return (
    <Chat chatId={'Chat:1'} />
  );
});

stories.add('Num messages', () => {
  return (
    <Chat chatId={'Chat:2'} />
  );
});

stories.add('Empty', () => {
  return (
    <Chat chatId={'Chat:3'} />
  );
});

stories.add('New message subscriptions', () => {
  button('User 1 message', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:1',
    chatId: 'Chat:3',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  button('User 2 message', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:2',
    chatId: 'Chat:3',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  return (
    <Chat chatId={'Chat:3'} />
  );
});
