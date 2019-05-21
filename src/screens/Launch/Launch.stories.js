import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import gql from 'graphql-tag';

import { getApolloDecorator, getContentDecorator } from '~storybook';
import Launch from './Launch';

const stories = storiesOf('Screens/Launch, Loading', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());
stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
    type Query {
      me: User!
      config: Config!
    }
    
    type User {
      id: ID!
      name: String!
      isEmailVerified: Boolean!
      isApproved: Boolean!
    }
    
    type Config {
      emailConfirmIsRequired: Boolean!
      userApproveIsRequired: Boolean!
    }
  `,

  resolvers: {
    Query: {
      me: () => ({ id: 'User:1', name: 'Grey Rabbit', isEmailVerified: true, isApproved: true }),
      config: () => ({ emailConfirmIsRequired: false, userApproveIsRequired: false }),
    },
  },
}));

// Stories
stories.add('Launch', () => {
  const mockedProps = {
    navigation: {
      navigate: () => null,
    },
  };

  return <Launch {...mockedProps} />;
});

stories.add('Loading', () => {
  const mockedProps = {
    navigation: {
      navigate: () => null,
      state: {
        params: {
          loading: true,
        },
      },
    },
  };

  return <Launch {...mockedProps} />;
});
