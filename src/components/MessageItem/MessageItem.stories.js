import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { select, boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import MessageItem from './MessageItem';

const stories = storiesOf('Components/MessageItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true, backgroundColor: '#F8F9FB' }));

const messages = [
  {
    id: 'Message:1',
    content: {
      text: 'Hi how are you?',
      image: null,
    },
    status: null,
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

  {
    id: 'Message:2',
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning? 12345',
      image: null,
    },
    status: null,
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

  {
    id: 'Message:3',
    content: {
      text: 'Hi how are you?',
      image: null,
    },
    createdAt: new Date(),
    status: 'DELIVERED',
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: 'Message:4',
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning?',
      image: null,
    },
    status: 'DELIVERED',
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

  {
    id: 'Message:5',
    content: {
      text: 'Hi how are you?',
      image: null,
    },
    createdAt: new Date(),
    status: 'READ',
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: 'Message:6',
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning?',
      image: null,
    },
    status: 'READ',
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

  {
    id: 'Message:7',
    content: {
      text: null,
      image: 'https://images.pexels.com/photos/531767/pexels-photo-531767.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    status: 'READ',
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

  type MessageContent {
    text: String
    image: String
  }

  enum MessageStatus {
    DELIVERED
    READ
  }
  
  type Message {
    id: ID!
    status: MessageStatus
    content: MessageContent
    createdAt: Date!
    user: User!
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { messages } }) => find(messages, { id }),
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const messageQuery = gql`
  query($id: ID!) {
    message: node(id: $id) {
      id
      ...on Message {
        id
        ...MessageItem_message  
      }
    }
  }

  ${MessageItem.fragments.message}
`;

const getMessage = (id, side) => {
  const first = boolean('First', true);
  const last = boolean('Last', false);
  const hasAvatar = boolean('Has Avatar', true);

  return (
    <Query query={messageQuery} variables={{ id }}>
      {({ data, loading }) => !loading && (
        <MessageItem
          message={data.message}
          left={side === 'left'}
          right={side === 'right'}
          last={last}
          first={first}
          hasAvatar={hasAvatar}
        />
      )}
    </Query>
  );
};

// Stories
stories.add('Short text', () => {
  const id = select('Status', {
    'Null': 'Message:1',
    'DELIVERED': 'Message:3',
    'READ': 'Message:5',
  }, 'Message:1');
  const side = select('Side', { 'Left': 'left', 'Right': 'right' }, 'left');

  return getMessage(id, side);
});

stories.add('Long text', () => {
  const id = select('Status', {
    'Null': 'Message:2',
    'DELIVERED': 'Message:4',
    'READ': 'Message:6',
  }, 'Message:2');
  const side = select('Side', { 'Left': 'left', 'Right': 'right' }, 'left');

  return getMessage(id, side);
});

stories.add('Photo', () => {
  const id = 'Message:7';
  const side = select('Side', { 'Left': 'left', 'Right': 'right' }, 'left');

  return getMessage(id, side);
});
