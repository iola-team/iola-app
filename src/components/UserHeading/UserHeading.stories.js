import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { find } from 'lodash';
import { Animated } from 'react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import UserHeading from './UserHeading';
import ScreenHeader from '../ScreenHeader';

const stories = storiesOf('Components/UserHeading', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ backgroundColor: '#FFFFFF' }));

const typeDefs = gql`
  scalar Date
  
  type Query {
    node(id: ID!): User!
  }

  type UserInfo {
    headline: String,
    location: String,
    about: String,
  }
  
  type Avatar {
    id: ID!
    url: String!
  }
  
  type User {
    id: ID!
    name: String!
    info: UserInfo!
    isOnline: Boolean!
    avatar: Avatar
  }
`;

const dataStore = {
  users: [
    {
      id: 'User:1',
      name: 'Roman Banan',
      isOnline: true,
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
      info: {
        headline: 'Software developer'
      }
    },
  ],
};

const resolvers = {
  Query: {
    node(root, { id }, { dataStore: { users } }) {
      return find(users, { id });
    },
  },
};

stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,
  dataStore,
}));

const userQuery = gql`
  query UserQuery($id: ID!) {
    user: node(id: $id) {
      ...UserHeading_user
    }
  }
  
  ${UserHeading.fragments.user}
`;

// Stories
const shrinkAnimationHeight = UserHeading.HEIGHT - ScreenHeader.HEIGHT;
const getAnimatedValue = () => {
  const value = number('Animation state', 1, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01,
  });

  return new Animated.Value(value);
};

stories.add('Default', () => (
  <Query query={userQuery} variables={{ id: 'User:1' }}>
    {({ loading, data }) => (
      <UserHeading
        shrinkAnimatedValue={getAnimatedValue()}
        shrinkAnimationHeight={shrinkAnimationHeight}
        loading={loading}
        user={data.user}
      >
        <Button primary>
          <Text>Chat</Text>
        </Button>
      </UserHeading>
    )}
  </Query>
));

stories.add('Loading', () => (
  <UserHeading
    loading
    shrinkAnimatedValue={getAnimatedValue()}
    shrinkAnimationHeight={shrinkAnimationHeight}
  />
));
