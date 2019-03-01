import { assign, find, isPlainObject, isArray } from 'lodash';
import { AsyncStorage } from 'react-native';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { from, split } from 'apollo-link';
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
    typeDefs: resolvers.typeDefs,
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

export default async ({ apiURL, subscriptionsURL }) => {
  /**
   * TODO: Review the app logic to decide if query batching is needed to be enabled back
   *
   * For now I disabled query batching, since we use manual batching technique such as fragments composition.
   */
  const enableBatching = false;

  let httpLink = createUploadLink({
    uri: apiURL,
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


  if (enableBatching) {
    const batchHttpLink = new BatchHttpLink({
      uri: apiURL,
    });

    const hasFiles = node => isArray(node) || isPlainObject(node)
        ? !!find(node, hasFiles)
        : node instanceof File || node instanceof Blob;

    httpLink = split(
      ({ query, variables }) => {
        const { kind, operation } = getMainDefinition(query);

        return (
          kind === 'OperationDefinition'
          && operation === 'mutation'
          && hasFiles(variables)
        );
      },
      httpLink,
      batchHttpLink,
    );
  }

  const sseLink = new SSELink({
    uri: subscriptionsURL,
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
