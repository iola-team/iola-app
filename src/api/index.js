import { ApolloClient } from 'apollo-client';
// import { BatchHttpLink } from "apollo-link-batch-http";
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export default () => {
  const cache = new InMemoryCache();
  const link = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cj6jbzcmn00zz0191mq94xnua'
  });

  return new ApolloClient({
    link,
    cache,
  });
};
