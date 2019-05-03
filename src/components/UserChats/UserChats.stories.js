import React from 'react';
import { find, filter, range, orderBy, cloneDeep } from 'lodash';
import gql from 'graphql-tag';
import { button, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import uuid from 'uuid/v4';
import { PubSub } from 'graphql-subscriptions';

import { getContainerDecorator, getApolloDecorator } from '~storybook';
import { createConnection } from '~storybook/decorators/Apollo';
import ChatList from '.';

const stories = storiesOf('Components/UserChats', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

let subscriptions;
const dataStore = {};

const createRandomMessage = (user, participant, chat) => {
  const message = {
    id: faker.random.uuid(),
    status: faker.random.arrayElement(['READ', 'DELIVERED']),
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: faker.random.arrayElement([user, participant]),
    chat: () => chat,
    __fake: true,
  };

  dataStore.messages.push(message);

  return message;
};

const createRandomUser = (id = faker.random.uuid()) => {
  const user = {
    id,
    name: faker.name.findName(),
    isOnline: faker.random.boolean(),
    avatar: {
      id: faker.random.uuid(),
      url: faker.image.avatar(),
    },
    __fake: true,
  };

  dataStore.users.push(user);

  return user;
};

const createRandomChat = (userId, participantId, chatId, addRandomMessages = true) => {
  const user = find(dataStore.users, { id: userId });
  const participant = find(dataStore.users, { id: participantId }) || createRandomUser(participantId);

  const chat = {
    id: chatId || faker.random.uuid(),
    user,
    participants: [user, participant],
    __fake: true,
  };

  if (addRandomMessages) {
    chat.messages =  () => range(faker.random.arrayElement([1, 2, 3])).map(() => (
      createRandomMessage(user, participant, chat)
    ));
  }

  dataStore.chats.push(chat);

  return chat;
};

const getRandomChats = (userId) => range(50).map(() => createRandomChat(userId));

dataStore.users = [
  {
    id: 'User:1',
    name: 'Roman Banan',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:1',
      url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
    },
  },

  {
    id: 'User:2',
    name: 'Grey Rabbit',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:2',
      url: 'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png',
    },
    chats: () => getRandomChats('User:2'),
  },

  {
    id: 'User:3',
    name: 'Jk KK',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:3',
      url: 'https://avatarfiles.alphacoders.com/458/45801.jpg',
    },
  },

  {
    id: 'User:4',
    name: 'Brad Pitt',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:4',
      url: 'https://pbs.twimg.com/profile_images/631273849435230208/LSWD16F9_400x400.jpg',
    },
  },
];

dataStore.chats = [
  {
    id: 'Chat:1',
    user: find(dataStore.users, { id: 'User:1' }),
    participants: [
      find(dataStore.users, { id: 'User:1' }),
      find(dataStore.users, { id: 'User:2' }),
    ],
  },
  {
    id: 'Chat:2',
    user: find(dataStore.users, { id: 'User:1' }),
    participants: [
      find(dataStore.users, { id: 'User:1' }),
      find(dataStore.users, { id: 'User:3' }),
    ],
  },

  {
    id: 'Chat:3',
    user: find(dataStore.users, { id: 'User:1' }),
    participants: [
      find(dataStore.users, { id: 'User:1' }),
      find(dataStore.users, { id: 'User:4' }),
    ],
  },
];

dataStore.messages = [
  {
    id: `Message:1`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(dataStore.users, { id: 'User:1' }),
    chat: find(dataStore.chats, { id: 'Chat:1' }),
  },

  {
    id: `Message:2`,
    status: 'READ',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(dataStore.users, { id: 'User:2' }),
    chat: find(dataStore.chats, { id: 'Chat:2' }),
  },

  {
    id: `Message:3`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(dataStore.users, { id: 'User:1' }),
    chat: find(dataStore.chats, { id: 'Chat:3' }),
  },

  {
    id: `Message:4`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(dataStore.users, { id: 'User:3' }),
    chat: find(dataStore.chats, { id: 'Chat:3' }),
  },
];

const freshDataStore = cloneDeep(dataStore);
const typeDefs = gql`
  scalar Date
  scalar Cursor

  type Query {
    me: User
    node(id: ID!): Node!
  }

  type Subscription {
    onMessageAdd(chatId: ID, userId: ID): MessageCreatePayload!
    onMessageUpdate(chatId: ID, userId: ID): MessageUpdatePayload!
  }

  type Avatar {
    id: ID!
    url: String!
  }

  interface Node {
    id: ID!
  }

  input UserChatsFilterInput {
    hasUnreadMessages: Boolean,
  }
  
  type User implements Node {
    id: ID!
    name: String!
    avatar: Avatar
    isOnline: Boolean!
    chats(filter: UserChatsFilterInput, first: Int, after: Cursor, last: Int, before: Cursor): UserChatsConnection!
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
    unreadMessages(first: Int, after: Cursor, last: Int, before: Cursor): ChatMessagesConnection!
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

  type MessageCreatePayload {
    user: User!
    chat: Chat!
    chatEdge: ChatEdge!
    node: Message!
    edge: MessageEdge!
  }

  type MessageUpdatePayload {
    user: User!
    chat: Chat!
    chatEdge: ChatEdge!
    node: Message!
    edge: MessageEdge!
  }
`;

const chatMessagesConnectionResolver = async (chat, args, { dataStore: { messages } }) => {
  const { notReadBy } = args.filter || {};
  let allChatMessages = filter(messages, ['chat.id', chat.id]);

  if (!allChatMessages.length && chat.messages) {
    allChatMessages = chat.messages();
  }

  if (notReadBy) {
    allChatMessages = filter(allChatMessages, ({ status, user }) => (
      status === 'DELIVERED' && user.id !== notReadBy
    ));
  }

  const chatMessages = orderBy(
    allChatMessages,
    'createdAt',
    'desc'
  );

  return createConnection(chatMessages, args);
};

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:2' }),
    node: (root, { id }, { dataStore: { users } }) => find(users, { id }),
  },

  Subscription: {
    onMessageAdd: {
      resolve: ({ content, userId, chatId }, args, { dataStore }) => {
        const user = find(dataStore.users, { id: args.userId });
        const messageUser = (
          find(dataStore.users, { id: userId }) || createRandomUser(userId)
        );

        const chat = (
          find(dataStore.chats, { id: chatId }) || createRandomChat(userId, args.userId, chatId, false)
        );

        const node = {
          id: uuid(),
          content,
          status: 'DELIVERED',
          createdAt: new Date(),
          user: messageUser,
          chat,
        };

        dataStore.messages.unshift(node);

        const cursor = 'first';
        const chatCursor = 'first';

        return {
          user,
          chat,
          chatEdge: {
            cursor: chatCursor,
            node: chat,
          },
          node,
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
        const chat = node.chat;
        const user = node.user;

        const cursor = 'first';
        const chatCursor = 'first';

        return {
          user,
          chat,
          chatEdge: {
            cursor: chatCursor,
            node: chat,
          },
          node,
          edge: {
            cursor,
            node,
          }
        };
      },

      subscribe: () => subscriptions.asyncIterator('onMessageUpdate'),
    },
  },

  User: {
    async chats(user, args, { dataStore: { chats, messages } }) {
      let userChats = filter(chats, ['user.id', user.id]);
      if (!userChats.length && user.chats) {
        userChats = user.chats();
      }

      const orderedChats = orderBy(userChats, [(chat) => {
        let chatMessages = filter(messages, ['chat.id', chat.id]);

        if (!chatMessages.length && chat.messages) {
          chatMessages = chat.messages();
        }

        const orderedMessages = orderBy(chatMessages, ['createdAt', 'desc']);

        return orderedMessages[0].createdAt;
      }, 'desc']);

      return createConnection(orderedChats, args, edge => ({ ...edge, user }));
    }
  },

  Chat: {
    messages: chatMessagesConnectionResolver
  },

  ChatEdge: {
    async unreadMessages({ node: chat, user }, args, context) {
      const newArgs = {
        ...args,
        filter: {
          notReadBy: user.id,
        },
      };

      return chatMessagesConnectionResolver(chat, newArgs, context);
    },
  },


  Node: {
    __resolveType: ({ id }) => {
      const [type] = id.split(':');

      return type;
    }
  }
};

stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,

  /**
   * Pass dataStore as ref - preventing default deep cloning
   */
  dataStore: () => dataStore,
  onReset() {
    Object.assign(dataStore, cloneDeep(freshDataStore));
    subscriptions = new PubSub();
  },
}));


// Stories
stories.add('Static list', () => <ChatList userId="User:1" />);
stories.add('Subscriptions', () => {
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

  return <ChatList userId="User:1" />;
});

stories.add('Long list', () => {
  button('Add chat', () => subscriptions.publish('onMessageAdd', {
    userId: faker.random.uuid(),
    chatId: faker.random.uuid(),
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  button('Add message to random chat', () => {
    const chat = faker.random.arrayElement(filter(dataStore.chats, '__fake'));

    subscriptions.publish('onMessageAdd', {
      userId: chat.participants[1].id,
      chatId: chat.id,
      content: {
        text: faker.hacker.phrase(),
      },
    });
  });

  return <ChatList userId="User:2" />;
});

stories.add('Empty list', () => {
  button('Add chat', () => subscriptions.publish('onMessageAdd', {
    userId: faker.random.uuid(),
    chatId: faker.random.uuid(),
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  button('Add message to random chat', () => {
    const chat = faker.random.arrayElement(filter(dataStore.chats, '__fake'));

    if (!chat) {
      return;
    }

    subscriptions.publish('onMessageAdd', {
      userId: chat.user.id,
      chatId: chat.id,
      content: {
        text: faker.hacker.phrase(),
      },
    });
  });

  return <ChatList userId="User:3" />;;
});

stories.add('Loading', () => <ChatList loading />);