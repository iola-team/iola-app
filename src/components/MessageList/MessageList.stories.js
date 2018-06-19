import React from 'react';
import { find, filter, uniqueId, range } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import { connectionFromArray } from 'graphql-relay';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import MessageList from './MessageList';

const stories = storiesOf('Components/MessageList', module);

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

const messages = range(100).map((index) => ({
  id: `Message:${index + 1}`,
  content: faker.hacker.phrase(),
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
    node(id: ID!): Chat!
  }

  type Avatar {
    id: ID!
    url: String!
  }

  type User {
    id: ID!
    name: String!
    avatar: Avatar
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type Chat {
    id: ID!
    messages(first: Int, after: Cursor, last: Int, before: Cursor): ChatMessagesConnection!
  }

  type Message {
    id: ID!
    user: User!
    chat: Chat!
    content: String
    createdAt: Date!
  }

  type MessageEdge {
    node: Message!
    cursor: Cursor!
  }

  type ChatMessagesConnection {
    pageInfo: PageInfo!
    edges: [MessageEdge!]!
    totalCount: Int
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { chats } }) => {
      return find(chats, { id });
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
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const chatQuery = gql`
  query {
    chat: node(id: "Chat:1") {
      id
      ...on Chat {
        id
        messages {
          edges {
            ...MessageList_edge  
          }
        }
      }
    }
  }

  ${MessageList.fragments.edge}
`;

// Stories
stories.add('Default', () => {
  return (
    <Query query={chatQuery}>
      {({ data, loading }) => !loading && (

        <MessageList
          edges={data.chat.messages.edges}
          getItemSide={({ user }) => user.id === 'User:1' ? 'left' : 'right'}
        />

      )}
    </Query>
  );
});
