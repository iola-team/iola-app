import React from 'react';
import gql from 'graphql-tag';
import { storiesOf } from '@storybook/react-native';
import { find, without, assign } from 'lodash';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import FriendsButton from '.';


const stories = storiesOf('Components/FriendsButton', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

const dataStore = () => ({
  friendships: [
    {
      node: 'User:2',
      friendship: { id: 'Friendship:1', user: 'User:2', friend: 'User:1', status: 'ACTIVE' },
    },

    {
      node: 'User:3',
      friendship: { id: 'Friendship:2', user: 'User:3', friend: 'User:1', status: 'PENDING' },
    },

    {
      node: 'User:4',
      friendship: { id: 'Friendship:3', user: 'User:1', friend: 'User:4', status: 'PENDING' },
    },
  ],
});

const typeDefs = gql`
  scalar Cursor

  type User {
    id: ID!
    friends(filter: UserFriendsFilterInput = {}, first: Int): UserFriendsConnection!
  }

  enum FriendshipStatus {
    IGNORED
    PENDING
    ACTIVE
  }

  input UserFriendsFilterInput {
      friendIdIn: [ID!]
      friendshipStatusIn: [FriendshipStatus!] = [ACTIVE]
  }

  type Friendship {
      id: ID!
      status: FriendshipStatus!
      user: User!
      friend: User!
  }

  type UserFriendEdge {
    node: User!
    friendship: Friendship!
  }

  type UserFriendsConnection {
    edges: [UserFriendEdge!]!
    totalCount: Int
  }

  input AddFriendInput {
    userId: ID!
    friendId: ID!
    status: FriendshipStatus
  }

  input DeleteFriendInput {
      userId: ID!
      friendId: ID!
  }

  type AddFriendPayload {
      user: User!
      friend: User!
      friendship: Friendship!
      edge: UserFriendEdge!
  }

  type DeleteFriendPayload {
      deletedId: ID!
      user: User!
      friend: User!
  }

  type Query {
    me: User!
  }

  type Mutation {
    addFriend(input: AddFriendInput!): AddFriendPayload!
    deleteFriend(input: DeleteFriendInput!): DeleteFriendPayload!
  } 
`;

const findEdge = (ds, userId, friendId) => find(ds.friendships, ({ friendship }) => (
  (userId === friendship.user && friendId === friendship.friend)
  || (userId === friendship.friend && friendId === friendship.user)
));

const resolvers = {
  Mutation: {
    async addFriend(root, { input }, { dataStore: ds  }) {
      await delay(1000);

      const { userId, friendId, status } = input;
      let edge = findEdge(ds, userId, friendId);

      if (edge) {
        assign(edge.friendship, {
          status: status || 'ACTIVE',
        });
      } else {
        edge = {
          node: friendId,
          friendship: {
            id: `Friendship:${ds.friendships.length}`,
            status: status || 'PENDING',
            user: userId,
            friend: friendId,
          },
        };

        ds.friendships.push(edge);
      }

      return {
        user: userId,
        friend: friendId,
        friendship: edge.friendship,
        edge,
      };
    },

    async deleteFriend(root, { input }, { dataStore: ds }) {
      await delay(1000);
      
      const { userId, friendId } = input;
      const edge = findEdge(ds, userId, friendId);

      assign(ds, {
        friendships: without(ds.friendships, edge),
      });

      return {
        deletedId: edge?.friendship.id,
        user: userId,
        friend: friendId,
      };
    }
  },

  Query: {
    me: () => 'User:1',
  },

  User: {
    id: (id) => id,
    friends(userId, { filter, ...args }, { dataStore: { friendships } }) {
      const { friendIdIn, friendshipStatusIn } = filter;
      const items = friendships.filter(({ friendship: { friend, user, status } }) => (
        [friend, user].includes(userId) 
        && friendshipStatusIn.includes(status)
        && ( friendIdIn ? friendIdIn.includes(friend) || friendIdIn.includes(user) : true )
      ));

      return createConnection(items, args, ({ cursor, node: item }) => ({
        cursor,
        ...item,
      }));
    },
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

// Stories
stories.add('Not friends', () => <FriendsButton userId="User:5" />);
stories.add('Active friendship', () => <FriendsButton userId="User:2" />);
stories.add('Received request', () => <FriendsButton userId="User:3" />);
stories.add('Sent request', () => <FriendsButton userId="User:4" />);
