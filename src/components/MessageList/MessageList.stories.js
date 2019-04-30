import React from 'react';
import { find, filter, uniqueId, random, range, sample, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import moment from 'moment';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from '~storybook';
import MessageList from './MessageList';

const stories = storiesOf('Components/MessageList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({
  backgroundColor: '#F3F4F7',
}));

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

const orderedNumMessages = range(100).map((index) => ({
  id: `Message:${unOrderedFakeMessages.length + index}`,
  content: {
    text: (index + 1).toString(),
    image: null,
  },
  status: faker.random.arrayElement(['READ', 'DELIVERED']),
  createdAt: moment().add(index, 'h').toDate(),
  user: faker.random.arrayElement(find(chats, { id: 'Chat:2' }).participants),
  chat: find(chats, { id: 'Chat:2' }),
}));

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
    edges: [MessageEdge!]!
    totalCount: Int
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { chats } }) => find(chats, { id }),
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
      };
    },
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

  const refreshing = boolean('Refreshing', false);
  const inverted = boolean('Inverted', true);
  const isLoadingMore = boolean('Loading more', true);

  return (
    <Query query={chatQuery} variables={variables}>
      {({ data, loading }) => !loading && (
        <MessageList
          edges={data.chat.messages.edges}
          getItemSide={({ user }) => user.id === 'User:1' ? 'left' : 'right'}
          loadingMore={isLoadingMore}

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
stories.add('Numbered messages', () => {
  const variables = {
    id: 'Chat:2',
    last: number('Count', 50),
  };

  const refreshing = boolean('Refreshing', false);
  const inverted = boolean('Inverted', true);
  const isLoadingMore = boolean('Loading more', true);

  return (
    <Query query={chatQuery} variables={variables}>
      {({ data, loading }) => !loading && (
        <MessageList
          edges={data.chat.messages.edges}
          getItemSide={({ user }) => user.id === 'User:1' ? 'left' : 'right'}
          loadingMore={isLoadingMore}

          inverted={inverted}
          refreshing={refreshing}
          onRefresh={action('onRefresh')}
          onEndReached={action('onEndReached')}
        />
      )}
    </Query>
  );
});
