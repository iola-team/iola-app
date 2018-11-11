import React from 'react';
import { filter, find, range } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import moment from 'moment';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import FriendList from '.';

const stories = storiesOf('Components/FriendList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const createUser = ({ id = faker.random.uuid() } = {}) => ({
  id,
  name: faker.name.findName(),
  activityTime: faker.date.recent(),
  avatar: {
    id: faker.random.uuid(),
    url: faker.image.avatar(),
  },
});

const typeDefs = gql`
  scalar Date
  scalar Cursor
  
  type Query {
    node(id: ID!): User!
  }
  
  type User {
    id: ID!
    name: String!
    activityTime: Date!
    avatar: Avatar
    friends(first: Int, after: Cursor, last: Int, before: Cursor): UserFriendsConnection!
  }
  
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type UserEdge {
    node: User!
    cursor: Cursor!
  }
  
  type UserFriendsConnection {
    pageInfo: PageInfo!
    edges: [UserEdge!]!
    totalCount: Int
  }

  type Avatar {
    id: ID!
    url: String!
  }
`;

const dataStore = {
  users: [
    createUser({ id: 'User:1' }),
  ],
};

const resolvers = {
  Query: {
    node(root, { id }, { dataStore: { users } }) {
      return find(users, { id });
    },
  },

  User: {
    friends({ id }, args) {
      const friends = range(100).map(() => createUser());
      const connection = connectionFromArray(friends, args);

      return {
        ...connection,
        totalCount: friends.length,
      };
    },
  },
};

stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,
  dataStore,
}));

// Stories
stories.add('Default', () => <FriendList userId="User:1" />);
