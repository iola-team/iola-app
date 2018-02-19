import gql from 'graphql-tag';

const resolvers = {
  Mutation: {
    incrementCounter(_, vars, { cache }) {
      const query = gql`
        query {
            counter
        }
      `;

      const { counter } = cache.readQuery({ query });

      cache.writeQuery({
        query,
        data: {
          counter: counter + 1,
        },
      });

      return null;
    }
  }
};
const defaults = {
  counter: 0
};

export default {
  resolvers,
  defaults,
}
