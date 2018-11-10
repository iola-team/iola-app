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
import PhotoList from '.';

const stories = storiesOf('Components/PhotoList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const createPhoto = ({ id = faker.random.uuid() } = {}) => ({
  id,
  url: faker.image.avatar(),
});

const typeDefs = gql`
  scalar Date
  scalar Cursor
  
  type Query {
    node(id: ID!): User!
  }
  
  type User {
    id: ID!
    photos(first: Int, after: Cursor, last: Int, before: Cursor): UserPhotoConnection!
  }

  type Photo {
    id: ID!
    url: String!
  }
  
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type PhotoEdge {
    node: Photo!
    cursor: Cursor!
  }

  type UserPhotoConnection {
    pageInfo: PageInfo!
    edges: [PhotoEdge!]!
    totalCount: Int
  }
`;

const dataStore = {
  users: [
    {
      id: 'User:1',
    },
  ],
};

const resolvers = {
  Query: {
    node(root, { id }, { dataStore: { users } }) {
      return find(users, { id });
    },
  },

  User: {
    photos({ id }, args) {
      const photos = range(30).map(() => createPhoto());
      const connection = connectionFromArray(photos, args);

      return {
        ...connection,
        totalCount: photos.length,
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
stories.add('Default', () => <PhotoList userId={'User:1'} />);
