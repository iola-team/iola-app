import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { selectV2 as select, withKnobs } from '@storybook/addon-knobs/react';
import moment from 'moment';
import faker from 'faker';
import { find, orderBy, sampleSize } from 'lodash';
import gql from 'graphql-tag';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import UserPhotos from './UserPhotos';

const stories = storiesOf('Components/UserPhotos', module);

const typeDefs = gql`
  scalar Cursor
  scalar Upload
  scalar Date

  type Photo {
    id: ID!
    url: String!
    caption: String!
    createdAt: Int!
  }

  type PhotoEdge {
    node: Photo!
    cursor: Cursor!
  }

  type UserPhotoConnection {
    edges: [PhotoEdge!]!
    totalCount: Int
  }

  type User {
    id: ID!
    name: String!
    photos(first: Int = 10, after: Cursor): UserPhotoConnection!
  }

  type Query {
    node(id: ID!): User!
  }
`;

const dataStore = (() => {
  const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const photos = ['https://newbor.by/upload/iblock/dbf/dom_1.jpg', 'https://newbor.by/upload/resize_cache/iblock/ded/1024_768_040cd750bba9870f18aada2478b24840a/dom_2.jpg', 'https://newbor.by/upload/iblock/5dd/dom_3.jpg', 'https://newbor.by/upload/iblock/759/dom_4.jpg', 'https://newbor.by/upload/resize_cache/iblock/995/1024_768_040cd750bba9870f18aada2478b24840a/dom_5.jpg', 'https://newbor.by/upload/resize_cache/iblock/d5c/1024_768_040cd750bba9870f18aada2478b24840a/dom_8.14.jpg', 'https://newbor.by/upload/resize_cache/iblock/1a9/1024_768_040cd750bba9870f18aada2478b24840a/dom_11.jpg', 'https://newbor.by/upload/iblock/13f/dom_8.jpg', 'https://newbor.by/upload/resize_cache/iblock/5d7/1024_768_040cd750bba9870f18aada2478b24840a/dom_10.jpg', 'https://newbor.by/upload/iblock/0f1/dom_13.jpg', 'https://newbor.by/upload/iblock/52d/6.6-min.jpg', 'https://newbor.by/upload/iblock/42d/6.3.jpg', 'https://newbor.by/upload/iblock/861/6.6.jpg', 'https://newbor.by/upload/iblock/7f2/detskiy-sad-7.jpg', 'https://newbor.by/upload/resize_cache/iblock/953/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-8.jpg', 'https://newbor.by/upload/iblock/55a/detskiy-sad-6.jpg', 'https://newbor.by/upload/iblock/951/detskiy-sad-1.jpg', 'https://newbor.by/upload/resize_cache/iblock/870/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-9.jpg', 'https://newbor.by/upload/resize_cache/iblock/0ff/1024_768_040cd750bba9870f18aada2478b24840a/fontan-v-novoy-borovoy-_-obshchiy-plan-_2.jpg', 'https://newbor.by/upload/resize_cache/iblock/3f5/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-kedrovogo-kvartala.jpg', 'https://newbor.by/upload/resize_cache/iblock/421/1024_768_040cd750bba9870f18aada2478b24840a/obshchestvennye-prostranstva.jpg', 'https://newbor.by/upload/resize_cache/iblock/7b0/1024_768_040cd750bba9870f18aada2478b24840a/veloboksy-vo-dvorakh-novoy-borovoy.jpg', 'https://newbor.by/upload/iblock/549/dji_0234.jpg', 'https://newbor.by/upload/iblock/8b6/dji_0286.jpg', 'https://newbor.by/upload/iblock/595/shkola_2.png', 'https://newbor.by/upload/iblock/6a8/shkola_1.png', 'https://newbor.by/upload/iblock/9cd/shkola_4.png', 'https://newbor.by/upload/iblock/cff/shkola_5.png', 'https://newbor.by/upload/iblock/689/shkola_6.png', 'https://newbor.by/upload/iblock/d34/shkola_7.png', 'https://newbor.by/upload/resize_cache/iblock/6b8/1024_768_040cd750bba9870f18aada2478b24840a/shkola_01.png', 'https://newbor.by/upload/iblock/b25/shkola_3-_2_.png', 'https://newbor.by/upload/resize_cache/iblock/a80/1024_768_040cd750bba9870f18aada2478b24840a/shkola_0.png', 'https://newbor.by/upload/iblock/cfe/shkola_8.png', 'https://newbor.by/upload/resize_cache/iblock/70e/1024_768_040cd750bba9870f18aada2478b24840a/vezd-v-novuyu-borovuyu.jpg'];
  const getRandomDate = () => (
    moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
  );

  return {
    users: [
      {
        name,
        id: 'User:1',
        photos: photos.map((url, id) => ({
          id,
          url,
          caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
          createdAt: getRandomDate(),
        })),
      },
      {
        name,
        id: 'User:2',
        photos: [],
      },
    ],
  };
})();

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore }) => find(dataStore.users, { id }),
  },

  User: {
    photos: (user, { first }) => {
      const photos = orderBy(user.photos, 'createdAt').slice(0, first);

      return {
        totalCount: photos.length,
        edges: photos.map((photo, index) => ({
          cursor: `cursor:${index}`,
          node: { ...photo },
        })),
      };
    },
  },
};

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));
stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

// Stories
stories.add('Default', () => {
  const userId = select('userId', {
    'User with photos': 'User:1',
    'User with no photos': 'User:2',
  }, 'User:1');

  return <UserPhotos userId={userId} />;
});
