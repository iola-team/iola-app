import React from 'react';
import { find, filter, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ChatListItem from './ChatListItem';

const stories = storiesOf('Components/ChatListItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());


const users = [
  {
    id: 'User:1',
    name: 'Roman Banan',
    activityTime: faker.date.recent(),
    avatar: {
      id: 'Avatar:1',
      url: 'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png',
    },
  },

  {
    id: 'User:2',
    name: 'Grey Rabbit',
    activityTime: faker.date.recent(),
    avatar: {
      id: 'Avatar:2',
      url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
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
    user: find(users, { id: 'User:1' }),
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
    user: find(users, { id: 'User:1' }),
    chat: find(chats, { id: 'Chat:3' }),
  },

  {
    id: `Message:5`,
    status: 'DELIVERED',
    content: {
      text: faker.hacker.phrase(),
    },
    createdAt: faker.date.recent(),
    user: find(users, { id: 'User:1' }),
    chat: find(chats, { id: 'Chat:3' }),
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
    me: User
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

  enum AvatarSize {
    SMALL
    MEDIUM
    BIG
  }
  
  type Avatar {
    id: ID!
    url(size: AvatarSize = SMALL): String!
  }
  
  type User {
    id: ID!
    name: String!
    activityTime: Date!
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
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
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
    me {
      id
    }
    chat: node(id: $id) {
      id
      ...ChatListItem_chat
    }
  }

  ${ChatListItem.fragments.chat}
`;

// Stories
stories.add('Default', () => {
  const chatId = select('Status', {
    'DELIVERED': 'Chat:1',
    'READ': 'Chat:2',
  }, 'Chat:1');

  const unreadCount = number('Unread count', 0);

  return (
    <Query query={chatQuery} variables={{ id: chatId }}>
      {({ data, loading }) => !loading && (
        <ChatListItem
          chat={data.chat}
          currentUserId={data.me.id}
          unreadMessagesCount={unreadCount}
        />
      )}
    </Query>
  );
});
