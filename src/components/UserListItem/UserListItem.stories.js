import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import UserListItem from './UserListItem';

const stories = storiesOf('Components/UserListItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

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
    isOnline: Boolean!
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
    isOnline: faker.random.boolean(),
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
  
  ${UserListItem.fragments.user}
`;

// Stories
const withData = (id, render) => (
  <Query query={userQuery} variables={{ id }}>
    {({ data, loading }) => render({ loading, user: loading ? null : data.user })}
  </Query>
);

const style = {

};

stories.add('Default', () => withData('User:1', ({ user }) => (
  <UserListItem user={user} style={style} last={boolean('Is last', false)} />
)));

stories.add('Loading', () => <UserListItem user={null} style={style} />);
