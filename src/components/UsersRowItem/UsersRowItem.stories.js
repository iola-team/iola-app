import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import UsersRowItem from './UsersRowItem';

const stories = storiesOf('Components/UsersRowItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

/**
 * Apollo decorator example
 */
const typeDefs = gql`
  scalar Date

  type Query {
    node(id: ID): User
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
};

stories.addDecorator(getApolloDecorator({ typeDefs, mocks }));

const userQuery = gql`
  query($id: ID!) {
    user: node(id: $id) {
      id
      ...UserListItem_user
    }
  }
  
  ${UsersRowItem.fragments.user}
`;

// Stories
const withData = (id, render) => (
  <Query query={userQuery} variables={{ id }}>
    {({ data, loading }) => render({ loading, user: loading ? null : data.user })}
  </Query>
);

stories.add('Default', () => withData('User:1', ({ user }) => (
  <UsersRowItem user={user} />
)));

stories.add('Loading', () => <UsersRowItem user={null} />);
