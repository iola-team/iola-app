import gql from 'graphql-tag';

const typeDefs = gql`
  type Counter {
    count: Int!
  }
  
  type Query {
    counter: Counter!
  }

  type Mutation {
    incrementCounter(by: Int = 1): Counter!
  }
`;

const resolvers = {
  Mutation: {
    incrementCounter(_, { by }, { cache }) {
      const query = gql`
        query {
          counter {
            count
          }
        }
      `;
      const { counter } = cache.readQuery({ query });
      const newCounter = {
        ...counter,
        count: counter.count + by,
      };

      cache.writeQuery({
        query,
        data: {
          counter: newCounter,
        },
      });

      return newCounter;
    },
  }
};
const defaults = {
  counter: {
    __typename: 'Counter',
    count: 0,
  },
};

export default {
  resolvers,
  defaults,
  typeDefs,
};
