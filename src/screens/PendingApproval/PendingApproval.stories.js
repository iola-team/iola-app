import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { button, withKnobs } from '@storybook/addon-knobs';
import gql from 'graphql-tag';
import { PubSub } from 'graphql-subscriptions';
import { find } from 'lodash';

import { getApolloDecorator } from '~storybook';
import PendingApproval from './PendingApproval';

const stories = storiesOf('Screens/PendingApproval', module);
const subscriptions = new PubSub();
const mockedProps = {
  navigation: {
    navigate: () => alert('Stub for navigation action'),
  },
};

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
    type Query {
      me: User!
    }
    
    type Subscription {
      onUserUpdate(userId: ID!): UserUpdatePayload!
    }
    
    type User {
      id: ID!
      isApproved: Boolean!
    }
    
    type UserUpdatePayload {
      user: User!
    }
  `,

  resolvers: {
    Query: {
      me: (root, args, { dataStore: { users } }) => {
        return find(users, { id: 'User:1' });
      }
    },

    Subscription: {
      onUserUpdate: {
        resolve: ({ userId }, args, { dataStore }) => {
          return {
            user: {
              id: userId,
              isApproved: true,
            },
          };
        },

        subscribe: () => subscriptions.asyncIterator('onUserUpdate'),
      },
    },
  },

  dataStore: () => ({
    users: [{
      id: 'User:1',
      isEmailVerified: false,
    }],
  }),
}));

// Stories
stories.add('Screen', () => {
  button('Approve User', () => subscriptions.publish('onUserUpdate', { userId: 'User:1' }));

  return <PendingApproval {...mockedProps} />;
});
