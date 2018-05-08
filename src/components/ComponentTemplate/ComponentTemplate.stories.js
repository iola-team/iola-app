import React from 'react';
import { withHandlers } from 'recompose';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { MockList } from 'graphql-tools';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import ComponentTemplate from './ComponentTemplate';

const stories = storiesOf('Components/ComponentTemplate', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

/**
 * Apollo decorator example
 */
stories.addDecorator(getApolloDecorator({
  typeDefs: gql`
   type User {
      id: ID!
      name: String!
    }

    type Query {
      me: User!
    }
  `,

  mocks: {
    User: () => ({
      id: 'User:1',
      name: 'Roman Banan',
    }),
  },
}));

const userQuery = gql`
  query {
    user: me {
      id
      ...ComponentTemplate_user
    }
  }
  
  ${ComponentTemplate.fragments.user}
`;

// Stories
stories.add('Default', () => {
  const something = number('Some number', 0);

  return (
    <Query query={userQuery}>
      {({ data, loading }) => !loading && (

        <ComponentTemplate
          user={data.user}
          something={something}
          onSomething={action('onSomething')}
        />

      )}
    </Query>
  );
});
