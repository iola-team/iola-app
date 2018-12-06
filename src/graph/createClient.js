import { assign, find, isPlainObject, isArray } from 'lodash';
import { AsyncStorage } from 'react-native';
import { toIdValue, getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { from, split, ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { CachePersistor } from 'apollo-cache-persist';
import { setContext } from 'apollo-link-context';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createUploadLink } from 'apollo-upload-client';
import { disableFragmentWarnings } from 'graphql-tag';
import EventSource from 'react-native-event-source';
import DeviceInfo from 'react-native-device-info';

import { AuthLink, ErrorLink, SSELink } from './links';
import resolvers from './resolvers';
import cacheRedirects from './cacheRedirects';
import introspectionQueryResultData from './meta/fragmentTypes.json';

disableFragmentWarnings();

export async function createClient({
  terminatingLink,
  persistorStorage = AsyncStorage,
  restoreCache = true,
}) {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => object.id || null,
    cacheRedirects,
  });

  const cachePersistor = new CachePersistor({
    cache,
    storage: persistorStorage,
    trigger: 'background',
    debug: true,
  });

  const withContext = setContext(() => ({
    cachePersistor,
  }));

  const stateLink = withClientState({
    resolvers: resolvers.resolvers,
    defaults: resolvers.defaults,

    /**
     * TODO: Uncomment when it will support gql AST or typeDefs will be required by Apollo Client
     */
    // typeDefs: resolvers.typeDefs,
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

  if (restoreCache) {
    // await cachePersistor.restore();
  }

  const authLink = new AuthLink();
  const errorLink = new ErrorLink();

  const client = new ApolloClient({
    link: from([
      errorLink,
      withContext.concat(
        stateLink,
      ),
      authLink,
      terminatingLink,
    ]),
    cache,
  });

  client.onResetStore(stateLink.writeDefaults);

  return client;
}

export default async () => {
  const debug = false;
  const debugQuery = debug ? '?XDEBUG_SESSION_START=PHPSTORM' : '';

  const queryUri = `http://192.168.0.100/oxwall/everywhere/api/graphql${debugQuery}`;
  const subscriptionUri = `http://192.168.0.100/oxwall/everywhere/api/subscriptions${debugQuery}`;

  const uploadLink = createUploadLink({
    uri: queryUri,
    fetch: (uri, allOptions, ...restArgs) => {
      const {
        uploadProgress,
        ...options
      } = allOptions;
      const promise = fetch(uri, options, ...restArgs);

      if (uploadProgress) {
        promise.uploadProgress(options.uploadProgress);
      }

      return promise;
    }
  });

  const batchHttpLink = new BatchHttpLink({
    uri: queryUri,
  });

  const hasFiles = node => isArray(node) || isPlainObject(node)
      ? !!find(node, hasFiles)
      : node instanceof File || node instanceof Blob;

  const httpLink = split(
    ({ query, variables }) => {
      const { kind, operation } = getMainDefinition(query);

      return (
        kind === 'OperationDefinition'
        && operation === 'mutation'
        && hasFiles(variables)
      );
    },
    uploadLink,
    batchHttpLink,
  );

  const sseLink = new SSELink({
    uri: subscriptionUri,
    streamId: DeviceInfo.getUniqueID(),
    EventSourceImpl: EventSource,
  });

  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    sseLink,
    httpLink,
  );

  return createClient({
    terminatingLink,
  });
};
