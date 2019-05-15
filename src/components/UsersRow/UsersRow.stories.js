import React from 'react';
import { range } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from '~storybook';
import UsersRow from './UsersRow';

const stories = storiesOf('Components/UsersRow', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({
  backgroundColor: '#FFFFFF',
}));

const createUser = ({ id = faker.random.uuid() } = {}) => ({
  id,
  name: faker.name.findName(),
  isOnline: faker.random.boolean(),
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
    isOnline: Boolean!
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
        ...UsersRow_edge
      }
    }
  }
  
  ${UsersRow.fragments.edge}
`;

stories.add('Full flow', () => (
  <Query query={usersQuery}>
    {({ loading, data }) => (
      <UsersRow edges={data?.users?.edges} loading={loading} />
    )}
  </Query>
));

stories.add('Initial Load', () => <UsersRow edges={[]} loading />);
