import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import MessageItem from './MessageItem';
import faker from 'faker'
import Chat from '../Chat/Chat'

const stories = storiesOf('Components/MessageItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const messages = [
  {
    id: `Message:1`,
    content: 'Hello World',
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },
];

const dataStore = { messages };
const typeDefs = gql`
  scalar Date

  type Query {
    node(id: ID!): Message!
  }

  type Avatar {
    id: ID!
    url: String!
  }
  
  type User {
    id: ID!
    name: String!
    avatar: Avatar
  }

  type Message {
    id: ID!
    content: String
    createdAt: Date!
    user: User!
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { messages } }) => {
      const message = find(messages, { id });

      console.log('Messsss', message);

      return message;
    },
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const messageQuery = gql`
  query {
    message: node(id: "Message:1") {
      id
      ...on Message {
        id
        ...MessageItem_message  
      }
    }
  }

  ${MessageItem.fragments.message}
`;

// Stories
stories.add('Default', () => {
  return (
    <Query query={messageQuery}>
      {({ data, loading }) => !loading && (

        <MessageItem
          message={data.message}
        />

      )}
    </Query>
  );
});
