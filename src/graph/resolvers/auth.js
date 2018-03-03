import gql from 'graphql-tag';

const typeDefs = gql`
  type Auth {
    token: String
  }

  type Query {
    auth: Auth!
  }

  type Mutation {
    storeAuthToken(token: String!): Boolean
  }
`;

const query = gql`
  query {
    auth {
      token
    }
  }
`;

const resolvers = {
  Mutation: {
    storeAuthToken(root, { token }, { cache }) {
      const { auth } = cache.readQuery({ query });

      cache.writeQuery({
        query,
        data: {
          auth: {
            ...auth,
            token,
          },
        }
      });

      return true;
    },
  },
};

const defaults = {
  auth: {
    __typename: 'Auth',
    token: null,
  },
};

export default {
  resolvers,
  typeDefs,
  defaults,
};
