import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    searchBarValue: String!
  }

  type Mutation {
    setSearchBarValue(value: String!): Boolean
    clearSearchBarValue: Boolean
  }
`;

const query = gql`
  query searchBarValueQuery {
    searchBarValue @client
  }
`;

const setSearchBarValue = async (value, { cache }) => {
  cache.writeQuery({
    query,
    data: {
      searchBarValue: value,
    },
  });

  return true;
};

const resolvers = {
  Mutation: {
    setSearchBarValue: (root, { value }, context) => setSearchBarValue(value, context),
    clearSearchBarValue: (root, args, context) => setSearchBarValue('', context),
  },
};

const defaults = {
  searchBarValue: '',
};

export default {
  typeDefs,
  resolvers,
  defaults,
};
