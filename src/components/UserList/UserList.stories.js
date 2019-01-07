import React from 'react';
import { range } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import UserList from './UserList';
import NoContent from '../NoContent';

const stories = storiesOf('Components/UserList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const createUser = ({ id = faker.random.uuid() } = {}) => ({
  id,
  name: faker.name.findName(),
  activityTime: faker.date.recent(),
  avatar: {
    id: faker.random.uuid(),
    url: faker.image.avatar(),
  },
});

const typeDefs = gql`
  scalar Date
  scalar Cursor
  
  interface Node {
    id: ID!
  }

  interface Edge {
    node: Node!
    cursor: Cursor!
  }

  type Query {
    users: UserConnection!
  }
  
  type User implements Node {
    id: ID!
    name: String!
    activityTime: Date!
    avatar: Avatar
  }
  
  type UserConnection {
    edges: [UserEdge!]!
  }

  type UserEdge implements Edge {
    node: User!
    cursor: Cursor!
  }

  type Avatar implements Node {
    id: ID!
    url: String!
  }
`;

const resolvers = {
  Query: {
    async users(root, args) {
      const users = range(30).map(() => createUser());
      const connection = connectionFromArray(users, args);

      await delay(2000);

      return {
        ...connection,
        totalCount: users.length,
      };
    },
  },

  User: () => createUser(),
};

stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,
}));


// Stories
const usersQuery = gql`
  query UsersQuery {
    users {
      edges {
        ...UserList_edge
      }
    }
  }
  
  ${UserList.fragments.edge}
`;

stories.add('Full flow', () => (
  <Query query={usersQuery}>
    {({ loading, data }) => (
      <UserList edges={loading ? [] : data.users.edges} loading={loading} />
    )}
  </Query>
));

stories.add('Initial Load', () => <UserList edges={[]} loading />);
stories.add('No items', () => (
  <UserList 
    edges={[]} 
    noContentText="No users"
  />
));
