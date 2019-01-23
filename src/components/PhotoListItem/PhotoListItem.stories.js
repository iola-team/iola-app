import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import PhotoListItem from './PhotoListItem';

const stories = storiesOf('Components/PhotoListItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

/**
 * Apollo decorator example
 */
const typeDefs = gql`
  type Query {
    node(id: ID): Photo
  }

  type Photo {
    id: ID!
    url: String!
  }
`;

const mocks = {
  Photo: () => ({
    id: faker.random.uuid(),
    url: faker.image.cats(),
  }),
};

stories.addDecorator(getApolloDecorator({ typeDefs, mocks }));

const photoQuery = gql`
  query($id: ID!) {
    photo: node(id: $id) {
      id
      ...PhotoListItem_photo
    }
  }
  
  ${PhotoListItem.fragments.photo}
`;

// Stories
const withData = (id, render) => (
  <Query query={photoQuery} variables={{ id }}>
    {({ data, loading }) => render({ loading, photo: loading ? null : data.photo })}
  </Query>
);

const style = {
  width: 200,
};

stories.add('Default', () => withData('Photo:1', ({ photo }) => (
  <PhotoListItem photo={photo} style={style} />
)));

stories.add('Progress', () => withData('Photo:1', ({ photo }) => (
  <PhotoListItem photo={photo} progress={.3} style={style} />
)));

stories.add('Loading', () => <PhotoListItem photo={null} style={style} />);
