import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import PhotosTabBarLabel from './PhotosTabBarLabel';

const stories = storiesOf('Components/PhotosTabBarLabel', module);

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
      photos: UserPhotoConnection!
    }

    type Query {
      me: User!
    }

    type UserPhotoConnection {
      totalCount: Int
    }
  `,

  mocks: true,
}));

const userQuery = gql`
  query {
    user: me {
      id
      ...PhotosTabBarLabel_user
    }
  }
  
  ${PhotosTabBarLabel.fragments.user}
`;

// Stories
stories.add('Default', () => (
  <Query query={userQuery}>
    {({ data }) => <PhotosTabBarLabel user={data.user} />}
  </Query>
));
