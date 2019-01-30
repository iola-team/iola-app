import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';

import { getApolloDecorator } from 'storybook';
import SignUp from './SignUp';

const stories = storiesOf('Screens/SignUp', module);

const typeDefs = gql`
  type Query {
    auth: Auth!
  }

  type Auth {
    token: String
  }
`;

const resolvers = {
  Query: {
    auth: () => ({ token: 'token' }),
  },
};

// Decorators
stories.addDecorator(getApolloDecorator({ typeDefs, resolvers }));

// @TODO: try to do it with decorator in the future: https://github.com/storybooks/storybook/issues/340
const mockedProps = {
  navigation: {
    navigate: () => alert('Mocked navigation'),
    goBack: () => alert('Mocked navigation'),
  },

  values: {
    login: '',
    name: '',
    email: '',
    password: '',
  },
};

// Stories
// @TODO: Looks like we need to mock the mutations...
stories.add('Screen', () => <SignUp {...mockedProps} />);
