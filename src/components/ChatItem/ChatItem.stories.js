import React from 'react';
import { find, filter, range, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ChatItem from './ChatItem';

const stories = storiesOf('Components/ChatItem', module);

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
  {
    id: `Message:1`,
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:1' }),
    chat: find(chats, { id: 'Chat:1' }),
  },
];

const dataStore = {
  users,
  chats,
  messages,
};

const typeDefs = gql`
  scalar Cursor
  scalar Date

  type Query {
    node(id: ID!): Chat!
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

  type Avatar {
    id: ID!
    url: String!
  }
  
  type User {
    id: ID!
    name: String!
    avatar: Avatar
  }

  type Chat {
    id: ID!
    user: User!
    participants: [User!]!
    messages(first: Int, after: Cursor, last: Int, before: Cursor): ChatMessagesConnection!
  }

  type MessageContent {
    text: String
  }
  
  type Message {
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
    node: (root, { id }, { dataStore: { users, chats } }) => find(chats, { id }),
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
};

/**
 * Apollo decorator example
 */
stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,
  dataStore,
}));

const chatQuery = gql`
  query ChatQuery($id: ID!){
    chat: node(id: $id) {
      id
      ...ChatItem_chat
    }
  }
  
  ${ChatItem.fragments.chat}
`;

// Stories
stories.add('Default', () => {
  return (
    <Query query={chatQuery} variables={{ id: 'Chat:1' }}>
      {({ data, loading }) => !loading && (
        <ChatItem
          chat={data.chat}
        />
      )}
    </Query>
  );
});
