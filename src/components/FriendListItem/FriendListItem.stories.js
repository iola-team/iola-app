import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import FriendListItem from './FriendListItem';

const stories = storiesOf('Components/FriendListItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

/**
 * Apollo decorator example
 */
const typeDefs = gql`
  scalar Date

  type Query {
    user(id: ID!): User
    friendship(id: ID!): Friendship
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

  type User {
    id: ID!
    name: String!
    activityTime: Date!
    avatar: Avatar
  }

  type Avatar {
    id: ID!
    url: String!
  }
`;

const mocks = {
  User: () => delay(1000).then(() => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    activityTime: faker.date.recent(),
  })),

  Avatar: () => ({
    id: faker.random.uuid(),
    url: faker.image.avatar(),
  }),

  Friendship: () => ({
    id: faker.random.uuid(),
    status: 'PENDING',
  }),
};

stories.addDecorator(getApolloDecorator({ typeDefs, mocks }));

const userQuery = gql`
  query($userId: ID! $friendshipId: ID!) {
    user(id: $userId) {
      id
      ...FriendListItem_user
    }

    friendship(id: $friendshipId) {
      id
      ...FriendListItem_friendship
    }
  }
  
  ${FriendListItem.fragments.user}
  ${FriendListItem.fragments.friendship}
`;

// Stories
const withData = (userId, friendshipId, render) => (
  <Query query={userQuery} variables={{ userId, friendshipId }}>
    {({ data, loading }) => render({
      loading,
      user: loading ? null : data.user,
      friendship: loading ? null : data.friendship,
    })}
  </Query>
);

stories.add('Default', () => withData('User:1', 'Friendship:1', ({ user, friendship }) => (
  <FriendListItem
    user={user}
    friendship={friendship}

    onPress={action('onPress')}
    onAcceptPress={action('onAcceptPress')}
    onIgnorePress={action('onIgnorePress')}
    onCancelPress={action('onCancelPress')}
  />
)));

stories.add('Loading', () => <FriendListItem user={null} />);
