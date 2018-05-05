import { onError } from 'apollo-link-error';

export default () => onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.error(
      `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
    ));
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});
