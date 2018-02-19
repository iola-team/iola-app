import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

export default () => {
  const cache = new InMemoryCache();
  const stateLink = withClientState({
    cache,
  });

  const httpLink = new BatchHttpLink({
    uri: 'https://api.graph.cool/simple/v1/cj6jbzcmn00zz0191mq94xnua'
  });

  return new ApolloClient({
    link: from([
      stateLink,
      httpLink,
    ]),
    cache,
  });
};
