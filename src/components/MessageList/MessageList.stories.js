import React from 'react';
import { find, filter, uniqueId, range, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, boolean, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import moment from 'moment';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from 'storybook/index';
import MessageList from './MessageList';

const stories = storiesOf('Components/MessageList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

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
];

const unOrderedFakeMessages = range(100).map((index) => ({
  id: `Message:${index + 1}`,
  content: {
    text: faker.hacker.phrase(),
  },
  createdAt: faker.date.recent(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:1' }).participants),
  chat: find(chats, { id: 'Chat:1' }),
}));

const orderedNumMessages = range(100).map((index) => {
  return {
    id: `Message:${unOrderedFakeMessages.length + index}`,
    content: {
      text: (index + 1).toString(),
    },
    createdAt: moment().add(index, 'h').toDate(),
    user: faker.random.arrayElement(find(chats, { id: 'Chat:2' }).participants),
    chat: find(chats, { id: 'Chat:2' }),
  };
});

const messages = [
  ...orderBy(unOrderedFakeMessages, 'createdAt'),
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
  query($id: ID!, $first: Int, $after: Cursor, $last: Int, $before: Cursor) {
    chat: node(id: $id) {
      id
      ...on Chat {
        id
        messages(last: $last after: $after first: $first before: $before) {
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
stories.add('Fake messages', () => {
  const variables = {
    id: 'Chat:1',
    last: number('Count', 50),
  };

  const refreshing = boolean('Refreshing', false)
  const inverted = boolean('Inverted', true)

  return (
    <Query query={chatQuery} variables={variables}>
      {({ data, loading }) => !loading && (

        <MessageList
          style={{
            paddingHorizontal: 10,
          }}
          edges={data.chat.messages.edges}
          getItemSide={({ user }) => user.id === 'User:1' ? 'left' : 'right'}

          inverted={inverted}
          refreshing={refreshing}
          onRefresh={action('onRefresh')}
          onEndReached={action('onEndReached')}
        />

      )}
    </Query>
  );
});

// Stories
stories.add('Num messages', () => {
  const variables = {
    id: 'Chat:2',
    last: number('Count', 50),
  };

  const refreshing = boolean('Refreshing', false)
  const inverted = boolean('Inverted', true)

  return (
    <Query query={chatQuery} variables={variables}>
      {({ data, loading }) => !loading && (

        <MessageList
          edges={data.chat.messages.edges}
          getItemSide={({ user }) => user.id === 'User:1' ? 'left' : 'right'}

          inverted={inverted}
          refreshing={refreshing}
          onRefresh={action('onRefresh')}
          onEndReached={action('onEndReached')}
        />

      )}
    </Query>
  );
});
