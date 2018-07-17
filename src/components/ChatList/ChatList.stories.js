import React from 'react';
import { find, filter, range, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import moment from 'moment'
import { createConnection } from 'storybook/decorators/Apollo';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import ChatList from './ChatList';

const stories = storiesOf('Components/ChatList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

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
];

const messages = [

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
  }

  type Message implements Node {
    id: ID!
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
    node: (root, { id }, { dataStore: { users, chats } }) => find(chats, { id }),
  },

  User: {
    async chats(user, args, { dataStore: { chats } }) {
      const userChats = filter(chats, ['user.id', user.id]);

      return createConnection(userChats, args);
    }
  },

  Chat: {
    async messages(chat, args, { dataStore: { messages } }) {
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

const userQuery = gql`
  query {
    user: me {
      id
      chats {
        edges {
          ...ChatList_edge
        }
      }
    }
  }
  
  ${ChatList.fragments.edge}
`;

// Stories
stories.add('Default', () => {
  return (
    <Query query={userQuery}>
      {({ data, loading }) => !loading && (
        <ChatList
          edges={data.user.chats.edges}
        />
      )}
    </Query>
  );
});
