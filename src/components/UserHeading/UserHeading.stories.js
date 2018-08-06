import React from 'react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Query } from 'react-apollo';
import { find } from 'lodash';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import UserHeading from './UserHeading';
import gql from 'graphql-tag'

const stories = storiesOf('Components/UserHeading', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

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
    avatar: Avatar
  }
`;

const dataStore = {
  users: [
    {
      id: 'User:1',
      name: 'Roman Banan',
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
`

// Stories
stories.add('Default', () => {



  return (
    <Query query={userQuery} variables={{ id: 'User:1' }}>{({ loading, data }) => !loading && (
      <UserHeading
        user={data.user}
        onChatPress={action('onChatPress')}
      />
    )}</Query>
  );
});
