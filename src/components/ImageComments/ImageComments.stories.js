import React from 'react';
import { Button, Text, View } from 'native-base';
import { storiesOf } from '@storybook/react-native';
import { button, withKnobs } from '@storybook/addon-knobs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { PubSub } from 'graphql-subscriptions';
import { find, orderBy, random, range, sample, sampleSize, shuffle } from 'lodash';
import delay from 'promise-delay';
import faker from 'faker';
import moment from 'moment';
import uuid from 'uuid/v4';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ImageComments from './ImageComments';
import { photoDetailsQuery } from '../ImageView/ImageView';

const stories = storiesOf('Components/ImageComments', module);
const subscriptions = new PubSub();

const typeDefs = gql`
  scalar Cursor
  scalar Date

  interface Node {
    id: ID!
  }

  type Query {
    me: User!
    node(id: ID!): Photo!
  }

  type User {
    id: ID!
    name: String!
    avatar: Avatar!
    activityTime: Date!
  }

  type Avatar {
    id: ID!
    url(size: AvatarSize = SMALL): String!
  }

  enum AvatarSize {
    SMALL
    MEDIUM
    BIG
  }

  type Photo implements Node {
    id: ID!
    url: String!
    caption: String!
    createdAt: Date!
    user: User!
    comments(first: Int, after: Cursor, last: Int, before: Cursor): PhotoCommentsConnection!
  }

  type PhotoCommentsConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [CommentEdge!]!
    totalCount: Int
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

  type CommentEdge {
    node: Comment!
    cursor: Cursor!
  }

  type Comment {
    id: ID!
    text: String!
    image: String
    createdAt: Date!
    user: User!
  }

  type Mutation {
    addPhotoComment(input: PhotoCommentInput!): PhotoCommentCreatePayload!
  }

  type Subscription {
    onPhotoCommentAdd(photoId: ID, userId: ID): PhotoCommentCreatePayload!
  }

  input PhotoCommentInput {
    userId: ID!
    photoId: ID!
    text: String!
  }

  type PhotoCommentCreatePayload {
    user: User!
    photo: Photo!
    node: Comment!
    edge: CommentEdge!
  }
`;

const dataStore = (() => {
  const generateName = () => `${faker.name.firstName()} ${faker.name.lastName()}`;
  const generateDate = () => (
    moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
  );
  const generateActivityTime = () => (
    moment(faker.date.between(moment().subtract(30, 'minutes').format(), moment())).toDate()
  );
  const users = range(10).map(index => ({
    id: `User:${index + 1}`,
    name: generateName(),
    avatar: {
      id: `Avatar:${index + 1}`,
      url: faker.image.avatar(),
    },
    activityTime: generateActivityTime(),
  }));
  const images = shuffle(['https://images.unsplash.com/photo-1508138221679-760a23a2285b', 'https://images.unsplash.com/photo-1485550409059-9afb054cada4', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee', 'https://images.unsplash.com/photo-1519627398411-c86cd6daf9ac', 'https://images.unsplash.com/photo-1524050586923-77990e57ae14', 'https://images.unsplash.com/photo-1429087969512-1e85aab2683d', 'https://images.unsplash.com/photo-1523575518836-9166d367179f', 'https://images.unsplash.com/photo-1443106479821-1617f92e6983', 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d', 'https://images.unsplash.com/photo-1494212062681-54f7aa085e11', 'https://images.unsplash.com/photo-1521318552330-5404359bc012']);
  const generateComments = () => {
    const comments = orderBy(range(99).map(index => ({
      id: `Comment:${index + 1}`,
      text: faker.lorem.text(),
      // image: random(0, 5) === 5 ? sample(images) : null,
      image: sample(images),
      createdAt: generateDate(),
      user: sample(users),
    })), 'createdAt', 'desc');

    comments.forEach((item) => {
      if (item.image && random(0, 2) === 2) item.text = '';
    });

    return comments;
  };
  const photos = range(2).map(index => ({
    id: `Photo:${index + 1}`,
    url: images[index],
    caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
    user: sample(users),
    createdAt: generateDate(),
    comments: index ? generateComments() : [],
  }));

  return {
    users,
    photos,
  };
})();

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
    node: async (root, { id }, { dataStore: { photos } }) => {
      // This is Kostyl but it's just for Storybook
      if (id === 'Photo:Placeholders') {
        await delay(60 * 1000);

        return find(photos, { id: 'Photo:2' });
      }

      return find(photos, { id });
    },
  },

  Subscription: {
    onPhotoCommentAdd: {
      resolve: ({ userId, photoId, text }, args, { dataStore }) => {
        const { users, photos } = dataStore;
        const user = find(users, { id: userId });
        const photo = find(photos, { id: photoId });
        const node = {
          id: uuid(),
          text,
          createdAt: new Date(),
          user,
        };
        const cursor = 'first';

        photo.comments.push(node);

        return {
          user,
          photo,
          node,
          edge: {
            node,
            cursor,
          },
        };
      },

      subscribe: () => subscriptions.asyncIterator('onPhotoCommentAdd'),
    },
  },

  Mutation: {
    async addPhotoComment(root, args, { dataStore }) {
      const { input: { photoId, userId, text } } = args;
      const { users, photos } = dataStore;
      const user = find(users, { id: userId });
      const photo = find(photos, { id: photoId });
      const node = {
        id: `Comment:${photo.comments.length + 1}`,
        createdAt: new Date(),
        image: null,
        text,
        user,
      };
      const cursor = 'first';

      await delay(2000);

      photo.comments.push(node);

      return {
        user,
        photo,
        node,
        edge: {
          node,
          cursor,
        },
      };
    },
  },

  Photo: {
    async comments(photo, args) {
      return createConnection(orderBy(photo.comments, 'createdAt', 'desc'), args);
    },
  },

  Node: {
    __resolveType: ({ id }) => {
      const [type] = id.split(':');

      return type;
    }
  }
};

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));
stories.addDecorator(getApolloDecorator({ typeDefs, dataStore, resolvers }));

// Stories

stories.add('Placeholders', () => (
  <ImageComments photoId="Photo:Placeholders" totalCount={0}>
    {onShowImageComments => (
      <Button onPress={onShowImageComments}>
        <Text>Show Comments (Placeholders)</Text>
      </Button>
    )}
  </ImageComments>
));

stories.add('Empty State', () => (
  <ImageComments photoId="Photo:1" totalCount={0}>
    {onShowImageComments => (
      <Button onPress={onShowImageComments}>
        <Text>Show Comments (Empty State)</Text>
      </Button>
    )}
  </ImageComments>
));

stories.add('Fake Comments', () => {
  const photoId = 'Photo:2';

  return (
    <Query query={photoDetailsQuery} variables={{ id: photoId }}>
      {({ loading, data: { photo } }) => loading ? null : (
        <ImageComments photoId={photoId} totalCount={photo.comments.totalCount}>
          {onShowImageComments => (
            <Button onPress={onShowImageComments}>
              <Text>Show Comments {photo.comments.totalCount}</Text>
            </Button>
          )}
        </ImageComments>
      )}
    </Query>
  );
});

stories.add('Subscription', () => {
  const photoId = 'Photo:1';

  button('Generate comment', () => subscriptions.publish('onPhotoCommentAdd', {
    photoId,
    userId: 'User:2',
    text: faker.company.catchPhrase(),
  }));

  return (
    <View>
      <Query query={photoDetailsQuery} variables={{ id: photoId }}>
        {({ loading, data: { photo } }) => loading ? null : (
          <ImageComments photoId={photoId} totalCount={photo.comments.totalCount}>
            {onShowImageComments => (
              <Button onPress={onShowImageComments}>
                <Text>Show comments</Text>
              </Button>
            )}
          </ImageComments>
        )}
      </Query>
      <Text>
        {'\n'}You can generate comments with "Generate comment" button from Storybook Knobs
      </Text>
    </View>
  );
});
