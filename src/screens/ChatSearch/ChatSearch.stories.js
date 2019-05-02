import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import faker from 'faker';
import { range } from 'lodash';
import delay from 'promise-delay';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { getContainerDecorator, getApolloDecorator } from '~storybook';
import { createConnection } from '~storybook/decorators/Apollo';
import { ScreenHeader, BackButton } from '~components';
import ChatSearch from './ChatSearch';

const stories = storiesOf('Screens/ChatSearch', module);
stories.addDecorator(getContainerDecorator());

const createUser = (data = {}) => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  isOnline: faker.random.boolean(),
  avatar: {
    id: faker.random.uuid(),
    url: faker.image.avatar(),
  },

  ...data,
});

const createChat = (user, participant) => ({
  id: faker.random.uuid(),
  user,
  messages: [],
  participants: [user, participant],
});

const createMessage = (user, chat) => ({
  id: faker.random.uuid(),
  status: faker.random.arrayElement(['READ', 'DELIVERED']),
  content: {
    text: faker.hacker.phrase(),
  },
  createdAt: faker.date.recent(),
  user,
  chat,
});

stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
    scalar Date
    scalar Cursor

    interface Node {
      id: ID!
    }

    interface Edge {
      node: Node!
      cursor: Cursor!
    }

    interface Connection {
      pageInfo: PageInfo!
      edges: [Edge!]!
      totalCount: Int
    }

    type User implements Node {
      id: ID!
      name: String!
      isOnline: Boolean!
      avatar: Avatar
      chats: UserChatsConnection!
    }

    type Avatar implements Node {
      id: ID!
      url: String!
    }

    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: Cursor
      endCursor: Cursor
    }

    type UserConnection {
      pageInfo: PageInfo!
      edges: [UserEdge!]!
      totalCount: Int
    }

    type UserEdge implements Edge {
      node: User!
      cursor: Cursor!
    }

    type Chat implements Node {
      id: ID!
      user: User!
      participants: [User!]!
      messages: ChatMessagesConnection!
    }

    type ChatEdge implements Edge {
      node: Chat!
      cursor: Cursor!
    }

    type UserChatsConnection implements Connection {
      pageInfo: PageInfo!
      edges: [ChatEdge!]!
      totalCount: Int
    }

    enum MessageStatus {
      DELIVERED
      READ
    }

    type MessageContent {
      text: String
      image: String
    }

    type Message implements Node {
      id: ID!
      user: User!
      status: MessageStatus
      content: MessageContent!
      createdAt: Date!
    }

    type MessageEdge implements Edge {
      node: Message!
      cursor: Cursor!
    }

    type ChatMessagesConnection implements Connection {
      pageInfo: PageInfo!
      edges: [MessageEdge!]!
      totalCount: Int
    }

    type Query {
      me: User
      users: UserConnection!
    }
  `,

  dataStore() {
    const me = createUser();
    const users = range(100).map(createUser);
    let chats = range(100).map(() => createChat(me, faker.random.arrayElement(users)));

    chats = chats.map((chat) => ({
      ...chat,
      messages: range(10).map(() => createMessage(
        faker.random.arrayElement(chat.participants),
        chat,
      )),
    }));

    return {
      users: [
        { ...me, chats },
        ...users,
      ],
    };
  },

  resolvers: {
    User: {
      async chats(user, args) {
        await delay(500);

        return createConnection(user.chats, args);
      },
    },

    Chat: {
      messages: (chat, args) => createConnection(chat.messages, args),
    },

    Query: {
      me: (root, args, { dataStore }) => dataStore.users[0],
      users: (root, args, { dataStore }) => createConnection(dataStore.users, args),
    },
  },
}));


/**
 * Stories
 */
const App = () => {
  const TabNavigator = createStackNavigator({ ChatSearch }, {
    defaultNavigationOptions: {
      headerLeft: <BackButton />,
      header: props => <ScreenHeader {...props} />,
    },
  });
  const Navigator = createAppContainer(TabNavigator);

  return <Navigator />;
};

stories.add('Default', () => <App />);