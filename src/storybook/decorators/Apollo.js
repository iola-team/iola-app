import React, { Component } from 'react';
import { isFunction, cloneDeep, range, identity } from 'lodash';
import { ApolloProvider } from 'react-apollo';
import { setContext } from "apollo-link-context";
import { ApolloLink, Observable, split } from 'apollo-link';
import { SchemaLink } from 'apollo-link-schema';
import { subscribe } from 'graphql';
import { toIdValue, getMainDefinition } from 'apollo-utilities';
import MockAsyncStorage from 'mock-async-storage';
import delay from 'promise-delay';
import { Buffer } from 'buffer';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';
import { connectionFromArray, cursorToOffset, offsetToCursor } from 'graphql-relay';

import { createClient } from 'graph';

/**
 * Set buffer polyfill, required by `graphql-relay`
 */
window.Buffer = Buffer;

class SubscriptionLink extends ApolloLink {
  constructor({ schema, context }) {
    super();

    this.schema = schema;
    this.context = context;
  }

  request({ query, variables, operationName }) {
    return new Observable(async observer => {
      let iterator;
      try {
        iterator = await subscribe(this.schema, query, null, this.context, variables, operationName);
      } catch (error) {
        !observer.closed && observer.error(error);

        return;
      }

      while (true) {
        if (observer.closed) {
          break;
        }

        const result = await iterator.next();
        observer.next(result.value);
      }
    });
  }
}

function createSchemaLink({ typeDefs, mocks, resolvers, dataStore = {} }) {
  const resolverValidationOptions = {
    requireResolversForResolveType: false,
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions,
  });

  if (mocks) {
    addMockFunctionsToSchema({
      schema,
      mocks
    });
  }

  if (resolvers) {
    addResolveFunctionsToSchema({
      schema,
      resolvers,
      resolverValidationOptions,
    });
  }

  const context = {
    dataStore,
  };

  const queryLink = new SchemaLink({ schema, context });
  const subscriptionLink = new SubscriptionLink({ schema, context });

  return split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    subscriptionLink,
    queryLink,
  );
}

function createProgressLink({ progressOptions = {} }) {
  const total = progressOptions.total || 100;
  const step = progressOptions.step || 10;
  const getDelay = isFunction(progressOptions.delay)
    ? progressOptions.delay
    : () => progressOptions.delay || Math.random() * 100;

  return setContext(async (request, { fetchOptions = {} }) => {
    let uploadPromise = Promise.resolve();
    let canceled = false;

    if (fetchOptions.uploadProgress) {
      uploadPromise = range(0, total + step, step).reduce((prev, tick) => prev.then(async () => {
        if (canceled) {
          throw new Error('Upload canceled');
        }

        await delay(getDelay(tick));

        if (!canceled) {
          fetchOptions.uploadProgress(tick, total);
        }
      }), uploadPromise);
    }

    if (fetchOptions.uploadStart) {
      fetchOptions.uploadStart({
        cancel: () => {
          console.log('API: cancel');
          canceled = true;
        },
      });
    }

    if (fetchOptions.uploadEnd) {
      uploadPromise.then(fetchOptions.uploadEnd, fetchOptions.uploadEnd);
    }

    await uploadPromise;
  });
}

function createTerminatingLink(options) {
  return ApolloLink.from([
    createProgressLink(options),
    createSchemaLink(options),
  ]);
}

class Provider extends Component {
  state = {
    client: null,
  };

  componentDidMount() {
    createClient({
      restoreCache: false,
      persistorStorage: new MockAsyncStorage(),
      terminatingLink: createTerminatingLink(this.props),
    }).then(client => this.setState({
      client,
    }));
  }

  render() {
    const { client } = this.state;
    const { children } = this.props;

    return client && (
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    );
  }
}

export const createConnection = (nodes, args, edgeBuilder = identity) => {
  const connection = connectionFromArray(
    nodes,
    args,
  );

  return {
    ...connection,
    edges: connection.edges.map(edgeBuilder),
    totalCount: nodes.length,
    metaInfo: {
      firstCursor: offsetToCursor(0),
    },
  };
};

export default ({
  typeDefs,
  mocks,
  resolvers,
  dataStore = {},
  onReset = () => {},
}) => story => {
  onReset();

  return (
    <Provider
      typeDefs={typeDefs}
      mocks={mocks}
      resolvers={resolvers}
      dataStore={
        isFunction(dataStore)
          ? dataStore()
          : cloneDeep(dataStore)
      }
    >
      {story()}
    </Provider>
  );
};
