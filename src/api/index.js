import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';

export const REDUCER_NAME = 'api';

const networkInterface = createBatchingNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj6jbzcmn00zz0191mq94xnua' });
const client = new ApolloClient({
  networkInterface,
  reduxRootSelector: state => state[REDUCER_NAME],
  connectToDevTools: true,
  dataIdFromObject: ({ id }) => id
});

export default client;