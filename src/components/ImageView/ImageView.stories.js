import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { find, orderBy } from 'lodash';
import faker from 'faker';
import moment from 'moment';
import { select, withKnobs } from '@storybook/addon-knobs/react';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import ImageView from './ImageView';
import UserPhotosCard from '../UserPhotosCard';
import PhotoEdit from '../PhotoEdit/PhotoEdit';

const stories = storiesOf('Components/ImageView', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const typeDefs = gql`
  scalar Cursor
  scalar Upload
  scalar Date

  type Photo {
    id: ID!
    url: String!
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
    photos(first: Int = 10, after: Cursor): UserPhotoConnection!
  }

  type Query {
    node(id: ID!): User!
  }
`;

const dataStore = (() => {
  const mockPhotos = ['https://newbor.by/upload/iblock/dbf/dom_1.jpg', 'https://newbor.by/upload/resize_cache/iblock/ded/1024_768_040cd750bba9870f18aada2478b24840a/dom_2.jpg', 'https://newbor.by/upload/iblock/5dd/dom_3.jpg', 'https://newbor.by/upload/iblock/759/dom_4.jpg', 'https://newbor.by/upload/resize_cache/iblock/995/1024_768_040cd750bba9870f18aada2478b24840a/dom_5.jpg', 'https://newbor.by/upload/resize_cache/iblock/d5c/1024_768_040cd750bba9870f18aada2478b24840a/dom_8.14.jpg', 'https://newbor.by/upload/resize_cache/iblock/1a9/1024_768_040cd750bba9870f18aada2478b24840a/dom_11.jpg', 'https://newbor.by/upload/iblock/13f/dom_8.jpg', 'https://newbor.by/upload/resize_cache/iblock/5d7/1024_768_040cd750bba9870f18aada2478b24840a/dom_10.jpg', 'https://newbor.by/upload/iblock/0f1/dom_13.jpg', 'https://newbor.by/upload/iblock/52d/6.6-min.jpg', 'https://newbor.by/upload/iblock/42d/6.3.jpg', 'https://newbor.by/upload/iblock/861/6.6.jpg', 'https://newbor.by/upload/iblock/7f2/detskiy-sad-7.jpg', 'https://newbor.by/upload/resize_cache/iblock/953/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-8.jpg', 'https://newbor.by/upload/iblock/55a/detskiy-sad-6.jpg', 'https://newbor.by/upload/iblock/951/detskiy-sad-1.jpg', 'https://newbor.by/upload/resize_cache/iblock/870/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-9.jpg', 'https://newbor.by/upload/resize_cache/iblock/0ff/1024_768_040cd750bba9870f18aada2478b24840a/fontan-v-novoy-borovoy-_-obshchiy-plan-_2.jpg', 'https://newbor.by/upload/resize_cache/iblock/3f5/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-kedrovogo-kvartala.jpg', 'https://newbor.by/upload/resize_cache/iblock/421/1024_768_040cd750bba9870f18aada2478b24840a/obshchestvennye-prostranstva.jpg', 'https://newbor.by/upload/resize_cache/iblock/7b0/1024_768_040cd750bba9870f18aada2478b24840a/veloboksy-vo-dvorakh-novoy-borovoy.jpg', 'https://newbor.by/upload/iblock/549/dji_0234.jpg', 'https://newbor.by/upload/iblock/8b6/dji_0286.jpg', 'https://newbor.by/upload/iblock/595/shkola_2.png', 'https://newbor.by/upload/iblock/6a8/shkola_1.png', 'https://newbor.by/upload/iblock/9cd/shkola_4.png', 'https://newbor.by/upload/iblock/cff/shkola_5.png', 'https://newbor.by/upload/iblock/689/shkola_6.png', 'https://newbor.by/upload/iblock/d34/shkola_7.png', 'https://newbor.by/upload/resize_cache/iblock/6b8/1024_768_040cd750bba9870f18aada2478b24840a/shkola_01.png', 'https://newbor.by/upload/iblock/b25/shkola_3-_2_.png', 'https://newbor.by/upload/resize_cache/iblock/a80/1024_768_040cd750bba9870f18aada2478b24840a/shkola_0.png', 'https://newbor.by/upload/iblock/cfe/shkola_8.png', 'https://newbor.by/upload/resize_cache/iblock/70e/1024_768_040cd750bba9870f18aada2478b24840a/vezd-v-novuyu-borovuyu.jpg'];
  const getRandomDate = () => (
    moment(faker.date.between(moment().subtract(3, 'weeks').format(), moment())).unix()
  );

  return {
    users: [
      {
        id: 'User:1',
        photos: mockPhotos.map((url, id) => ({
          id,
          url,
          createdAt: getRandomDate(),
        })),
      },
      {
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
console.log(user);

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

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const query = gql`
  query($userId: ID!) {
    user: node(id: $userId) {
      id
      ...PhotoEdit_user
    }
  }

  ${PhotoEdit.fragments.user}
`;

// Stories
stories.add('Function as a Child Component', () => {
  const userId = select('userId', {
    'User:1': 'User with photos',
    'User:2': 'User with no photos',
  }, 'User:1');

  return (
    <Query query={query} variables={{ userId }}>
      {({ data: { user }, loading }) => !loading && (
        <ImageView images={user.photos.edges.map(({ node: { url, createdAt } }) => ({
          url,
          createdAt,
        }))}>
          {onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
        </ImageView>
      )}
    </Query>
  );
});
