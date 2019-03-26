import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { button, select, withKnobs } from '@storybook/addon-knobs';
import gql from 'graphql-tag';
import { PubSub } from 'graphql-subscriptions';
import delay from 'promise-delay';
import { find } from 'lodash';

import { getApolloDecorator } from '~storybook';
import EmailVerification from './EmailVerification';

const stories = storiesOf('Screens/EmailVerification', module);
const subscriptions = new PubSub();
const mockedProps = {
  navigation: {
    navigate: () => alert('Stub for navigation action'),
  },
};

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getApolloDecorator({
  /* eslint-disable max-len */
  typeDefs: gql`
    type Query {
      me: User!
    }

    type Mutation {
      sendEmailVerificationInstructions(input: EmailVerificationInstructionsInput!): EmailVerificationInstructionsPayload!
    }
    
    type Subscription {
      onUserUpdate(userId: ID): UserUpdatePayload!
    }
    
    type User {
      id: ID!
      email: String!
      isEmailVerified: Boolean!
    }
    
    input EmailVerificationInstructionsInput {
      email: String!
    }
    
    enum EmailVerificationInstructionsErrorCode {
      ERROR_COMMON
      ERROR_NOT_FOUND
    }
    
    type EmailVerificationInstructionsPayload {
      success: Boolean!
      errorCode: EmailVerificationInstructionsErrorCode
    }
    
    type UserUpdatePayload {
      user: User!
    }
  `,
  /* eslint-enable */

  resolvers: {
    Query: {
      me: (root, args, { dataStore: { users } }) => {
        return find(users, { id: 'User:1' });
      }
    },

    Mutation: {
      sendEmailVerificationInstructions: async (root, { input }, { dataStore }) => {
        const knobSelect = [null, 'ERROR_COMMON', 'ERROR_NOT_FOUND'];
        const errorCode = select('errorCode', knobSelect, knobSelect[0]);

        await delay(1000 + Math.random() * 1000);

        return {
          success: !errorCode,
          errorCode,
        };
      },
    },

    Subscription: {
      onUserUpdate: {
        resolve: ({ userId }, args, { dataStore }) => {
          return {
            user: {
              id: userId,
              isEmailVerified: true,
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
      email: 'roman@banan.com',
      isEmailVerified: false,
    }],
  }),
}));

// Stories
stories.add('Screen', () => {
  button('Verify User Email', () => subscriptions.publish('onUserUpdate', {
    userId: 'User:1',
  }));

  return <EmailVerification {...mockedProps} />;
});
