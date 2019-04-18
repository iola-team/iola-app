import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import FriendsTabBarLabel from './FriendsTabBarLabel';

const stories = storiesOf('Components/FriendsTabBarLabel', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

/**
 * Apollo decorator example
 */
stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
   type User {
      id: ID!
      friends: UserFriendsConnection!
    }

    type Query {
      me: User!
    }

    type UserFriendsConnection {
      totalCount: Int
    }
  `,

  mocks: true,
  resolvers: {
    User: {
      friends: () => ({
        totalCount: 10,
      }),
    },
  },
}));

const userQuery = gql`
  query {
    user: me {
      id
      ...FriendsTabBarLabel_user
    }
  }
  
  ${FriendsTabBarLabel.fragments.user}
`;

// Stories
stories.add('My friends', () => (
  <Query query={userQuery}>
    {({ data }) => <FriendsTabBarLabel user={data.user} />}
  </Query>
));