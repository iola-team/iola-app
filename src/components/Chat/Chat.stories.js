import React from 'react';
import { find, filter, uniqueId, range } from 'lodash';
import { withHandlers } from 'recompose';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import { connectionFromArray } from 'graphql-relay';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import Chat from './Chat';

const stories = storiesOf('Components/Chat', module);

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

const messages = range(50).map((index) => ({
  id: `Message:${index + 1}`,
  content: {
    text: faker.hacker.phrase(),
  },
  createdAt: faker.date.recent(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:1' }).participants),
  chat: find(chats, { id: 'Chat:1' }),
}));

const dataStore = {
  users,
  chats,
  messages,
};

const typeDefs = gql`
  scalar Date
  scalar Cursor
  
  type Query {
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
    node: (root, { id }, { dataStore: { users, chats } }) => {
      const [type] = id.split(':');
      const nodes = type === 'User' ? users : chats;

      return find(nodes, { id });
    },
  },

  Chat: {
    messages(chat, args, { dataStore: { messages } }) {
      const chatMessages = filter(messages, ['chat.id', chat.id]);

      const connection = connectionFromArray(
        filter(messages, ['chat.id', chat.id]),
        args,
      );

      return {
        ...connection,
        totalCount: chatMessages.length,
      }
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
    user: node(id: "User:1") {
      id
      ...on User {
        id
        ...Chat_user
      }
    }

    chat: node(id: "Chat:1") {
      id
      ...on Chat {
        id
        ...Chat_chat
      }
    }
  }
  
  ${Chat.fragments.user}
  ${Chat.fragments.chat}
`;

// Stories
stories.add('Default', () => {
  return (
    <Query query={userQuery}>
      {({ data, loading }) => !loading && (

        <Chat
          user={data.user}
          chat={data.chat}
        />

      )}
    </Query>
  );
});
