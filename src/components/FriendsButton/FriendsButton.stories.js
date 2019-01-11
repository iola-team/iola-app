import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { find } from 'lodash';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import FriendsButton from './FriendsButton';

const stories = storiesOf('Components/FriendsButton', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

const dataStore = () => ({
  edges: [
    {
      node: 'User:2',
      friendship: { id: 'Friendship:1', user: 'User:2', friend: 'User:1', status: 'ACTIVE' },
    },

    {
      node: 'User:3',
      friendship: { id: 'Friendship:2', user: 'User:3', friend: 'User:1', status: 'PENDING' },
    },

    {
      node: 'User:4',
      friendship: { id: 'Friendship:3', user: 'User:1', friend: 'User:4', status: 'PENDING' },
    },
  ],
});

const typeDefs = gql`
  scalar Cursor

  type User {
    id: ID!
  }

  enum FriendshipStatus {
    IGNORED
    PENDING
    ACTIVE
  }

  type Friendship {
      id: ID!
      status: FriendshipStatus!
      user: User!
      friend: User!
  }

  type UserFriendEdge {
    node: User!
    friendship: Friendship!
  }

  type Query {
    edge(userId: ID!): UserFriendEdge!
  }
`;

const resolvers = {
  Query: {
    edge: (root, { userId }, { dataStore: { edges } }) => find(edges, { node: userId }),
  },

  User: {
    id: (id) => id,
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const edgesQuery = gql`
  query FriendshipEdgesQuery($id: ID!) {
    edge(userId: $id) {
      ...FriendsButton_edge
    }
  }
  
  ${FriendsButton.fragments.edge}
`;

// Stories
const withData = (id, props = {}) => (
  <Query query={edgesQuery} variables={{ id }}>
    {({ data }) => (
      <FriendsButton 
        edge={data.edge}
        onAcceptPress={action('onAcceptPress')}
        onCancelPress={action('onCancelPress')}
        onDeletePress={action('onDeletePress')}
        onAddPress={action('onAddPress')}
  
        {...props} 
      />
    )}
  </Query>
);

stories.add('Not friends', () => (
  <FriendsButton 
    friendship={null}

    onDeletePress={action('onDeletePress')}
    onAcceptPress={action('onAcceptPress')}
    onCancelPress={action('onCancelPress')}
    onAddPress={action('onAddPress')}
  />
));
stories.add('Active friendship', () => withData('User:2'));
stories.add('Received request', () => withData('User:3'));
stories.add('Sent request', () => withData('User:4'));
