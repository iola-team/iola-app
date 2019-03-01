import gql from 'graphql-tag';
import { constant } from 'lodash';

const typeDefs = gql`
  extend type User {
    searchHistory(key: String!): [ID!]!
  }
`;

const historyQuery = gql`
  {
    searchHistory @client
  }
`;

const resolvers = {
  User: {
    searchHistory: constant([])
  },
};

export default {
  resolvers,
  typeDefs,
};
