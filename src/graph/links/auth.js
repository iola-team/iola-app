import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'
import { AUTHORIZATION } from 'http-header-fields';

const query = gql`
  query {
    auth @client {
      token
    }
  }
`;

export default () => setContext((request, { cache, headers }) => {
  const { auth: { token } } = cache.readQuery({ query });

  return {
    headers: {
      ...headers,
      [AUTHORIZATION]: token ? `Bearer ${token}` : "",
    },
  };
});
