import { onError } from 'apollo-link-error';

export default () => onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, category, locations, path, originalError }) => {
      if (category !== 'user') {
        console.error(`
          [GraphQL error]:
            message: ${message},
            category: ${category},
            location: ${JSON.stringify(locations)},
            path: ${path},
            originalError: ${typeof originalError === 'object' && originalError.message}
        `);
      }
    });
  }

  if (networkError) console.error(JSON.stringify(networkError));
});
