import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { find, range } from 'lodash';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';
import { connectionFromArray } from 'graphql-relay';
import { NetworkStatus } from 'apollo-client';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import PhotoList from './PhotoList';

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
    async photos({ id }, args) {
      const photos = range(30).map(() => createPhoto());
      const connection = connectionFromArray(photos, args);

      await delay(2000);

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

const userQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        photos {
          edges {
            ...PhotoList_edge
          }
        }
      }
    }
  }
  
  ${PhotoList.fragments.edge}
`;

stories.add('Full flow', () => (
  <Query query={userQuery} variables={{ id: 'User:1' }}>
    {({ loading, networkStatus, data: { user } }) => (
      <PhotoList 
        edges={loading ? [] : user.photos.edges} 
        networkStatus={networkStatus}
      />
    )}
  </Query>
));

stories.add('Initial Load', () => (
  <PhotoList 
    edges={[]} 
    networkStatus={NetworkStatus.loading}
  />
));

stories.add('No items', () => (
  <PhotoList 
    edges={[]}
    networkStatus={NetworkStatus.ready}
  />
));