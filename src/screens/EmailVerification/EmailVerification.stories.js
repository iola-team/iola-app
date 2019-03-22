import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import { select, withKnobs } from '@storybook/addon-knobs';
import delay from 'promise-delay';
import { find } from 'lodash';

import EmailVerification from './EmailVerification';
import { getApolloDecorator } from '~storybook';

const stories = storiesOf('Screens/EmailVerification', module);
const knobSelect = [null, 'ERROR_COMMON', 'ERROR_NOT_FOUND'];
const getErrorCodeFromKnobSelect = () => select('errorCode', knobSelect, knobSelect[0]);

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getApolloDecorator({
  /* eslint-disable max-len */
  typeDefs: gql`
    type Query {
      me: User!
    }
    
    type User {
      id: ID!
      email: String!
    }

    type Mutation {
      sendEmailVerificationInstructions(input: EmailVerificationInstructionsInput!): EmailVerificationInstructionsPayload!
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
        const errorCode = getErrorCodeFromKnobSelect();

        await delay(1000 + Math.random() * 1000);

        return {
          success: !errorCode,
          errorCode,
        };
      },
    },
  },

  dataStore: () => ({
    users: [{
      id: 'User:1',
      email: 'roman@banan.com',
    }],
  }),
}));

// Stories
stories.add('Screen', () => <EmailVerification />);
