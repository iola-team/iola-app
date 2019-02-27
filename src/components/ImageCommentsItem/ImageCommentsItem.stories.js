import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { storiesOf } from '@storybook/react-native';
import { find } from 'lodash';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import ImageCommentsItem from './ImageCommentsItem';

const stories = storiesOf('Components/ImageCommentsItem', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

const comments = [
  {
    id: 'Comment:1',
    text: 'Knock, knock',
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://steamavatars.co/wp-content/uploads/2016/03/funny_steam_avatars.jpg',
      },
    },
  },
  {
    id: 'Comment:2',
    text: 'There is a California dude going through a desert. He\'s wearing shorts, sunglasses, a towel and listening to music on his walkman. He\'s having a good time. Suddenly he sees a caravan approaching. He stops the Arabs and ask them cheerfully: "Hey dudes how far is the sea?" They look at each other and say: "Two thousand miles!" And he says: "Wow what a cool beach!!!"',
    createdAt: new Date(),
    user: {
      id: 'User:2',
      name: 'Grey Expert',
      avatar: {
        id: 'Avatar:2',
        url: 'http://steamavatars.co/wp-content/uploads/2016/05/cat_funny_steam_avatar.jpg',
      },
    },
  },
];

const dataStore = { comments };
const typeDefs = gql`
  scalar Date

  type Query {
    node(id: ID!): Comment!
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
  
  type User {
    id: ID!
    name: String!
    avatar: Avatar
  }

  type Avatar {
    id: ID!
    url: String!
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { comments } }) => find(comments, { id }),
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const commentQuery = gql`
  query($id: ID!) {
    comment: node(id: $id) {
      ...ImageCommentsItemFragment  
    }
  }

  ${ImageCommentsItem.fragments.comment}
`;

// Stories
stories.add('Short text', () => (
  <Query query={commentQuery} variables={{ id: 'Comment:1' }}>
    {({ data: { comment }, loading }) => !loading && <ImageCommentsItem comment={comment} />}
  </Query>
));

stories.add('Long text', () => (
  <Query query={commentQuery} variables={{ id: 'Comment:2' }}>
    {({ data: { comment }, loading }) => !loading && <ImageCommentsItem comment={comment} />}
  </Query>
));

stories.add('Placeholder', () => (
  <ImageCommentsItem comment={{ isPlaceholder: true, opacity: 1 }} />
));
