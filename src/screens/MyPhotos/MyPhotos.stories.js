import React from 'react';
import gql from 'graphql-tag';
import faker from 'faker';
import delay from 'promise-delay';
import { find, range, without, uniqueId, orderBy } from 'lodash';
import { storiesOf } from '@storybook/react-native';
import { withKnobs, number } from '@storybook/addon-knobs';
import { connectionFromArray } from 'graphql-relay';
import { createAppContainer } from 'react-navigation';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import { createHeadingTabsNavigator } from 'components';
import MyPhotos from './MyPhotos';

const stories = storiesOf('Screens/MyPhotos', module);
stories.addDecorator(withKnobs());
stories.addDecorator(getContainerDecorator());

const typeDefs = gql`
  scalar Date
  scalar Cursor
  scalar Upload
  
  type Query {
    me: User!
  }

  type Mutation {
    addUserPhoto(input: UserPhotoCreateInput!): UserPhotoCreatePayload!
    deleteUserPhoto(id: ID!): UserPhotoDeletePayload!
  }
  
  input UserPhotoCreateInput {
    userId: ID!
    file: Upload!
    uploadTime: Date
  }

  type UserPhotoCreatePayload {
    user: User!
    node: Photo!
    edge: PhotoEdge!
  }

  type UserPhotoDeletePayload {
    deletedId: ID!
    user: User!
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

const createPhoto = ({ id = faker.random.uuid() } = {}) => ({
  id,
  url: faker.image.avatar(),
  createdAt: faker.date.recent(),
});

const dataStore = () => ({
  me: { id: 'User:1' },
  photos: range(0).map(() => createPhoto()),
});

const resolvers = {
  Query: {
    me: () => ({ id: 'User:1' }),
  },

  Mutation: {
    deleteUserPhoto: async (root, { id }, { dataStore: ds }) => {
      ds.photos = without(ds.photos, find(ds.photos, { id }));

      return {
        deletedId: id,
        user: ds.me,
      };
    },

    addUserPhoto: async (root, { input }, { dataStore: ds }) => {
      const node = {
        id: uniqueId('Photo:'),
        url: input.file.blobPath,
        createdAt: input.uploadTime || new Date(),
      };

      ds.photos.unshift(node);

      await delay(1000 + Math.random() * 1000);

      return {
        user: ds.me,
        node,
        edge: {
          node,
          cursor: '-',
        }
      };
    },
  },

  User: {
    async photos(root, args, { dataStore: { photos } }) {
      const orderedPhotos = orderBy(photos, 'uploadTime');
      const connection = connectionFromArray(orderedPhotos, args);

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

/**
 * Stories
 */
const App = () => {
  const TabNavigator = createHeadingTabsNavigator({
    MyPhotos,
  });

  const Navigator = createAppContainer(TabNavigator);

  return <Navigator />;
};

stories.add('Default', () => <App />);