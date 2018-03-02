import { setContext } from 'apollo-link-context/lib/index'
import gql from 'graphql-tag'

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
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});
