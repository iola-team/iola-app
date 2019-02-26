import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import faker from 'faker';
import { range } from 'lodash';
import delay from 'promise-delay';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { getContainerDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import { ScreenHeader, BackButton } from 'components';
import UserSearch from './UserSearch';

const stories = storiesOf('Screens/UserSearch', module);
stories.addDecorator(getContainerDecorator());

stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
    scalar Date
    scalar Cursor

    interface Node {
      id: ID!
    }

    interface Edge {
      node: Node!
      cursor: Cursor!
    }

    interface Connection {
      pageInfo: PageInfo!
      edges: [Edge!]!
      totalCount: Int
    }

    type User implements Node {
      id: ID!
      name: String!
      activityTime: Date!
      avatar: Avatar
    }

    type Avatar implements Node {
      id: ID!
      url: String!
    }

    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: Cursor
      endCursor: Cursor
    }

    type UserConnection implements Connection {
      pageInfo: PageInfo!
      edges: [UserEdge!]!
      totalCount: Int
    }

    type UserEdge implements Edge {
      node: User!
      cursor: Cursor!
    }

    input UsersFilterInput {
      search: String = ""
    }

    type Query {
      users(filter: UsersFilterInput = {}, first: Int = 10, after: Cursor): UserConnection!
    }
  `,

  dataStore: () => ({
    users: range(1000).map(() => ({
      id: faker.random.uuid(),
      name: faker.name.findName(),
      activityTime: faker.date.recent(),
      avatar: {
        id: faker.random.uuid(),
        url: faker.image.avatar(),
      },
    })),
  }),

  resolvers: {
    Query: {
      async users(root, args, { dataStore }) {
        const users = dataStore.users.filter(({ name }) => {
          return name.toLowerCase().indexOf(args.filter.search.toLowerCase()) === 0;
        });

        await delay(1000);

        return createConnection(users, args);
      },
    },
  },
}));


/**
 * Stories
 */
const App = () => {
  const TabNavigator = createStackNavigator({ UserSearch }, {
    defaultNavigationOptions: {
      headerLeft: <BackButton />,
      header: props => <ScreenHeader {...props} />,
    },
  });
  const Navigator = createAppContainer(TabNavigator);

  return <Navigator />;
};

stories.add('Default', () => <App />);