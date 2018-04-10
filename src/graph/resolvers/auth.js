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
    clearAuthToken: Boolean
  }
`;

const query = gql`
  query {
    auth {
      token
    }
  }
`;

const writeToken = async (token, { cache }) => {
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
};

const resolvers = {
  Mutation: {
    storeAuthToken: (root, { token }, context) => writeToken(token, context),
    clearAuthToken: (root, args, context) => writeToken(null, context),
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
