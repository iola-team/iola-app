import gql from 'graphql-tag';

const typeDefs = gql`
  type Mutation {
    clearCache: Boolean
  }
`;

const resolvers = {
  Mutation: {
    clearCache(root, args, { cachePersistor, client }) {
      cachePersistor.purge();
      client.resetStore();

      return true;
    },
  },
};

export default {
  resolvers,
  typeDefs,
};
