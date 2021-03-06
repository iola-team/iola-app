import React from 'react';
import { find, filter, random, range, orderBy, sample } from 'lodash';
import gql from 'graphql-tag';
import { button, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import { cursorToOffset, offsetToCursor } from 'graphql-relay';
import delay from 'promise-delay';
import uuid from 'uuid/v4';
import moment from 'moment';
import { PubSub } from 'graphql-subscriptions';

import { getContainerDecorator, getApolloDecorator } from '~storybook';
import { createConnection } from '~storybook/decorators/Apollo';
import Chat from './index';

const stories = storiesOf('Components/Chat', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({ backgroundColor: '#F3F4F7' }));

const subscriptions = new PubSub();
const users = [
  {
    id: 'User:1',
    name: 'Roman Banan',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:1',
      url: faker.image.avatar(),
    },
  },

  {
    id: 'User:2',
    name: 'Grey Rabbit',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:2',
      url: faker.image.avatar(),
    },
  },

  {
    id: 'User:3',
    name: 'Jk KK',
    isOnline: faker.random.boolean(),
    avatar: {
      id: 'Avatar:3',
      url: faker.image.avatar(),
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

const images = ['https://images.pexels.com/photos/531767/pexels-photo-531767.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'https://2.bp.blogspot.com/-THqzUlWepv8/UeFZbv7l7AI/AAAAAAAAQvA/BJ60SUXVefY/s1600/funny+smileys+hd87.jpg', 'https://static1.squarespace.com/static/55aa89d0e4b0ee6ed81f6331/t/5b5635bb2b6a28e234472a55/1532376521063/25749667758_da70c7c9a5_o.jpg', 'https://www.foundshit.com/images/tall-bike-03.jpg', 'https://www.bbcgoodfood.com/sites/default/files/guide/guide-image/2014/02/steak-main.jpg', 'https://sweetandsavorymeals.com/wp-content/uploads/2018/07/How-To-Cook-Frozen-Chicken-Breasts-In-The-Instant-Pot-4.jpg', 'http://d2814mmsvlryp1.cloudfront.net/wp-content/uploads/2016/10/Edna-Valley-Risotto-Prep-3.jpg', 'https://cook.fnr.sndimg.com/content/dam/images/cook/fullset/2012/8/8/0/71761_steak_s4x3.jpg.rend.hgtvcom.966.725.suffix/1393360583825.jpeg', 'https://www.outdoorlife.com/sites/outdoorlife.com/files/styles/2000_1x_/public/images/2018/04/best-ways-to-cook-venison.jpg?itok=jxryzJfD&fc=50,50'];

const unOrderedFakeMessages = range(100).map((index) => ({
  id: `Message:${index + 1}`,
  content: {
    text: faker.hacker.phrase(),
    image: random(3) === 0 ? sample(images) : null,
  },
  status: faker.random.arrayElement(['READ', 'DELIVERED']),
  createdAt: faker.date.recent(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:1' }).participants),
  chat: find(chats, { id: 'Chat:1' }),
}));

const orderedNumMessages = range(300).map((index) => ({
  id: `Message:${unOrderedFakeMessages.length + index}`,
  content: {
    text: (index + 1).toString(),
    image: random(3) === 0 ? sample(images) : null,
  },
  status: 'READ',
  createdAt: moment().subtract(1, 'months').add(index, 'h').toDate(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:2' }).participants),
  chat: find(chats, { id: 'Chat:2' }),
}));

const imagesMessages = range(300).map((index) => ({
  id: `Message:${unOrderedFakeMessages.length + index}`,
  content: {
    text: null,
    image: sample(images),
  },
  status: 'READ',
  createdAt: moment().subtract(1, 'months').add(index, 'h').toDate(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:3' }).participants),
  chat: find(chats, { id: 'Chat:3' }),
}));

const messages = [
  ...unOrderedFakeMessages,
  ...orderedNumMessages,
  ...imagesMessages,
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
    onMessageAdd(chatId: ID, userId: ID): MessageCreatePayload!
    onMessageUpdate(chatId: ID, userId: ID): MessageUpdatePayload!
  }
  
  type Mutation {
    addMessage(input: MessageInput!, after: Cursor, before: Cursor, at: Cursor): MessageCreatePayload!
    markMessagesAsRead(input: MarkMessagesAsReadInput!): [MessageUpdatePayload!]!
  }

  input MarkMessagesAsReadInput {
    userId: ID!
    messageIds: [ID!]!
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
    isOnline: Boolean!
    chat(id: ID, recipientId: ID): Chat
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
    image: String
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
    chatId: ID
    recipientIds: [ID!]
    content: MessageContentInput!
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
        };

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

  Mutation: {
    async addMessage(root, args, { dataStore }) {
      const { input, at, after, before } = args;
      const { messages, users, chats } = dataStore;

      const user = find(users, { id: input.userId });
      let chat = input.chatId && find(chats, { id: input.chatId });

      if (!chat && input.recipientIds) {
        const recipients = users.filter(({ id }) => input.recipientIds.includes(id));

        chat = {
          id: `Chat:${chats.length}`,
          user,
          participants: [
            user,
            ...recipients,
          ],
        };

        chats.push(chat);
      }

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
    },

    async markMessagesAsRead(root, { input: { userId, messageIds } }, { dataStore: { messages, users } }) {
      return messageIds.map((id) => {
        const node = find(messages, { id });
        const user = find(users, { id: userId });
        const cursor = offsetToCursor(0);

        node.status = 'READ';

        subscriptions.publish('onMessageUpdate', {
          messageId: id,
        });

        return {
          node,
          chat: node.chat,
          user,
          edge: {
            cursor,
            node,
          },
        };
      });
    },
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

  User: {
    async chats(user, args, { dataStore: { chats } }) {
      const userChats = filter(chats, ['user.id', user.id]);

      return createConnection(userChats, args);
    },

    async chat(user, args, { dataStore: { chats } }) {
      if (args.id) {
        return find(chats, { id: args.id });
      }

      if (!args.recipientId) {
        return null;
      }

      const userChats = filter(chats, ['user.id', user.id])
        .filter(({ participants }) => find(participants, ['id', args.recipientId]));

      return userChats[0] || null;
    },
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
stories.add('Fake messages', () => (
  <Chat chatId="Chat:1" />
));

stories.add('Num messages', () => (
  <Chat chatId="Chat:2" />
));

stories.add('All messages are images', () => (
  <Chat chatId="Chat:3" />
));

stories.add('Empty', () => (
  <Chat chatId="Chat:4" />
));

stories.add('New message subscriptions', () => {
  /**
   * TODO:
   * I had to disable this button, since subscription events about messages from current user are disabled in `Chat` component.
   * First we need figure out how to make it possible to receive these events without producing message duplicates,
   * than we will be able to enable the button back.
   */
  // button('User 1 message', () => subscriptions.publish('onMessageAdd', {
  //   userId: 'User:1',
  //   chatId: 'Chat:3',
  //   content: {
  //     text: faker.hacker.phrase(),
  //   },
  // }));

  button('New message received', () => subscriptions.publish('onMessageAdd', {
    userId: 'User:2',
    chatId: 'Chat:3',
    content: {
      text: faker.hacker.phrase(),
    },
  }));

  return (
    <Chat chatId="Chat:3" />
  );
});

stories.add('Chat with user', () => <Chat recipientId="User:2" />);

stories.add('New chat with user', () => (
  <Chat recipientId="User:3" />
));
