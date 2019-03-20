import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import { find } from 'lodash';

import EmailVerification from './EmailVerification';
import { getApolloDecorator } from '~storybook';

const stories = storiesOf('Screens/EmailVerification', module);

stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
    type Query {
      me: User!
    }
    
    type User {
      id: ID!
      email: String!
    }
  `,

  resolvers: {
    Query: {
      me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
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
