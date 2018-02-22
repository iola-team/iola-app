import { assign } from 'lodash';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

import resolvers from './resolvers';

export default () => {
  const cache = new InMemoryCache();
  const stateLink = withClientState({
    ...resolvers,
    cache,
  });

  /**
   * Reload resolvers if module.hot is available
   */
  if (module.hot) {
    module.hot.accept(() => {
      const newResolvers = require('./resolvers').default;

      assign(resolvers.resolvers, newResolvers.resolvers);
    });
  }

  const httpLink = new BatchHttpLink({
    uri: 'http://localhost/ow/oxwall/everywhere/api/graphql',
  });

  return new ApolloClient({
    link: from([
      stateLink,
      httpLink,
    ]),
    cache,
  });
};
