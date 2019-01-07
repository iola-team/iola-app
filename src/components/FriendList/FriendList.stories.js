import React from 'react';
import { filter, find, range } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';
import delay from 'promise-delay';
import { connectionFromArray } from 'graphql-relay';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import FriendList from '.';

const stories = storiesOf('Components/FriendList', module);

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
    node(id: ID!): User!
  }
  
  type User implements Node {
    id: ID!
    name: String!
    activityTime: Date!
    avatar: Avatar
    friends(first: Int, after: Cursor, last: Int, before: Cursor): UserFriendsConnection!
  }
  
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type UserFriendEdge implements Edge {
    node: User!
    cursor: Cursor!
    friendship: Friendship!
  }
  
  type UserFriendsConnection {
    pageInfo: PageInfo!
    edges: [UserFriendEdge!]!
    totalCount: Int
  }

  type Avatar implements Node {
    id: ID!
    url: String!
  }

  enum FriendshipStatus {
    IGNORED
    PENDING
    ACTIVE
  }

  type Friendship implements Node {
    id: ID!
    status: FriendshipStatus!
    user: User!
  }
`;

const dataStore = {
  users: [
    createUser({ id: 'User:1' }),
  ],
};

const resolvers = {
  Query: {
    node(root, { id }, { dataStore: { users } }) {
      return find(users, { id });
    },
  },

  User: {
    async friends({ id }, args, { dataStore: { users } }) {
      const me = find(users, { id });
      const friends = range(12).map(() => createUser());
      const { edges, ...connection } = connectionFromArray(friends, args);

      await delay(1000);

      let pendingCount = 6;
      let friendRequestsCount = 3;

      return {
        ...connection,
        edges: edges.map(edge => ({
          ...edge,
          friendship: {
            id: `Friendship:${edge.node.id}`,
            status: pendingCount-- >= 0 ? 'PENDING' : 'ACTIVE',
            user: friendRequestsCount-- >= 0 ? edge.node : me,
          }
        })),
        totalCount: friends.length,
      };
    },
  },

};

stories.addDecorator(getApolloDecorator({
  typeDefs,
  resolvers,
  dataStore,
}));

// Stories
const friendsQuery = gql`
  query FriendsQuery {
    user: node(id: "User:1") {
      ...on User {
        friends {
          edges {
            ...FriendList_edge
          }
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

stories.add('Full flow', () => (
  <Query query={friendsQuery}>
    {({ loading, data }) => (
      <FriendList 
        edges={loading ? [] : data.user.friends.edges} 
        loading={loading} 

        onItemPress={action('onItemPress')}
        onAcceptPress={action('onAcceptPress')}
        onIgnorePress={action('onIgnorePress')}
        onCancelPress={action('onCancelPress')}
      />
    )}
  </Query>
));

stories.add('Initial Load', () => <FriendList edges={[]} loading />);
stories.add('No items', () => (
  <FriendList 
    edges={[]} 
    noContentText="No friends"
  />
));
