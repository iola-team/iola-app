import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';

import { getApolloDecorator } from 'storybook';
import SignIn from './SignIn';

const stories = storiesOf('Screens/SignIn', module);

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

// @TODO: try to do it with decorator in the future: https://github.com/storybooks/storybook/issues/340
const mockedProps = {
  navigation: {
    navigate: () => alert('Mocked navigation'),
  },
};

// Decorators
stories.addDecorator(getApolloDecorator({ typeDefs, resolvers }));

// Stories
stories.add('Screen', () => <SignIn {...mockedProps} />);
