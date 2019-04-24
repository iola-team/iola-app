import { onError } from 'apollo-link-error';

export default () => onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ debugMessage, message, category, locations, path, originalError }) => {
      if (category !== 'user') {
        console.error(`
          [GraphQL error]:
            debugMessage: ${debugMessage},
            message: ${message},
            category: ${category},
            location: ${JSON.stringify(locations)},
            path: ${path},
            originalError: ${typeof originalError === 'object' && originalError.message}
        `);
      }
    });
  }

  if (networkError && networkError.statusCode) {
    console.error(`
      [Network error]: ${networkError.name}\n
      [statusCode]: ${networkError.statusCode}\n
      [response]: ${JSON.stringify(networkError.response)}
    `);
  }
});
