import React from 'react';
import { Image, View } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import moment from 'moment';
import faker from 'faker';
import { find, orderBy, random, range, remove, sample, sampleSize, shuffle, without } from 'lodash';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ImageView from './ImageView';
import TouchableOpacity from '../TouchableOpacity';
import PhotoList from '../PhotoList';

const stories = storiesOf('Components/ImageView', module);

const typeDefs = gql`
  scalar Cursor
  scalar Date

  type Query {
    me: User!
    node(id: ID!): Photo!
  }

  type User {
    id: ID!
    name: String!
    avatar: Avatar!
    photos(first: Int, after: Cursor, last: Int, before: Cursor): UserPhotoConnection!
  }

  type Avatar {
    id: ID!
    url(size: AvatarSize = SMALL): String!
    small(size: AvatarSize = SMALL): String!
  }

  enum AvatarSize {
    SMALL
    MEDIUM
    BIG
  }

  type UserPhotoConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [PhotoEdge!]!
    totalCount: Int
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type ConnectionMetaInfo {
    firstCursor: Cursor!
  }

  type PhotoEdge {
    node: Photo!
    cursor: Cursor!
  }
  
  type Photo {
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
    deleteUserPhoto(id: ID!): UserPhotoDeletePayload!
  }
  
  type UserPhotoDeletePayload {
    deletedId: ID!
    user: User!
  }
`;

const myPhotosQuery = gql`
  query myPhotosQuery {
    me {
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

const deletePhotoMutation = gql`
  mutation deleteUserPhotoMutation($id: ID!) {
    result: deleteUserPhoto(id: $id) {
      deletedId
    }
  }
`;

const dataStore = (() => {
  const generateName = () => `${faker.name.firstName()} ${faker.name.lastName()}`;
  const generateDate = () => (
    moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
  );
  const users = Array.from({ length: 10 }).map((item, index) => ({
    id: `User:${index + 1}`,
    name: generateName(),
    avatar: {
      id: `Avatar:${index + 1}`,
      url: faker.image.avatar(),
    },
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

  return {
    users,

    photos: Array.from({ length: images.length }).map((item, index) => ({
      id: `Photo:${index + 1}`,
      url: images[index],
      caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
      user: users[0],
      createdAt: generateDate(),
      comments: generateComments(),
    })),
  };
})();

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
    node: (root, { id }, { dataStore: { photos } }) => find(photos, { id }),
  },

  User: {
    photos(user, args, { dataStore: { photos } }) {
      return createConnection(photos, args);
    },
  },

  Photo: {
    comments(photo, args) {
      return createConnection(photo.comments, args);
    },
  },

  Mutation: {
    deleteUserPhoto: async (root, { id }, { dataStore }) => {
      const photo = find(dataStore.photos, photo => photo.id === id);

      return {
        deletedId: photo.id,
        user: photo.user,
      };
    },
  },
};

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));
stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

// Stories
stories.add('With delete action + comments', () => {
  const styles = {
    view: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    image: {
      width: 100,
      height: 100,
      marginRight: 8,
      marginBottom: 8,
      borderRadius: 8,
    },
  };

  let ComposedComponent = ({ data: { loading, me }, deletePhoto }) => {
    if (loading) return null;

    const onDeletePhoto = (photoId) => {
      const optimisticResponse = {
        result: {
          __typename: 'UserPhotoDeletePayload',
          deletedId: photoId,
          user: {
            __typename: 'User',
            id: me.id,
          },
        },
      };
      const update = (cache, { data: { result: { deletedId } } }) => {
        const data = cache.readQuery({ query: myPhotosQuery });

        remove(me.photos.edges, edge => edge.node.id === deletedId);

        cache.writeQuery({
          query: myPhotosQuery,
          data,
        });
      };

      deletePhoto({
        variables: { id: photoId },
        optimisticResponse,
        update,
      });
    };

    const { photos: { edges } } = me;

    return (
      <ImageView edges={edges} deletePhoto={onDeletePhoto}>
        {onShowImage => (
          <View style={styles.view}>
            {edges.map((item, index) => {
              const { node: { id, url } } = item;

              return (
                <TouchableOpacity key={id} onPress={() => onShowImage({item, index})}>
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ImageView>
    );
  };

  ComposedComponent = graphql(myPhotosQuery)(ComposedComponent);
  ComposedComponent = graphql(deletePhotoMutation, {
    name: 'deletePhoto',
  })(ComposedComponent);

  return <ComposedComponent />;
});
