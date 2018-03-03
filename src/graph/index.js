import { assign } from 'lodash';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

import resolvers from './resolvers';
import { AuthLink } from './links';

export default () => {
  const cache = new InMemoryCache({
    dataIdFromObject: (object) => {
      return object.id || null;
    }
  });

  const stateLink = withClientState({
    resolvers: resolvers.resolvers,
    defaults: resolvers.defaults,

    /**
     * TODO: Uncomment when it will support gql AST or typeDefs will be required by Apollo Client
     */
    //typeDefs: resolvers.typeDefs,
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

  const authLink = new AuthLink();
  const httpLink = new BatchHttpLink({
    uri: 'http://localhost/ow/oxwall/everywhere/api/graphql',
  });

  return new ApolloClient({
    link: from([
      stateLink,
      authLink,
      httpLink,
    ]),
    cache,
  });
};
