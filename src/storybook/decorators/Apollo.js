import React, { Component } from 'react';
import { isFunction, cloneDeep } from 'lodash';
import { ApolloProvider } from 'react-apollo';
import { SchemaLink } from 'apollo-link-schema';
import MockAsyncStorage from 'mock-async-storage';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';

import { createClient } from 'graph';

function createSchemaLink({ typeDefs, mocks, resolvers, dataStore = {} }) {
  const schema = makeExecutableSchema({ typeDefs });

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
    });
  }

  return new SchemaLink({
    schema,
    context: {
      dataStore,
    },
  });
}

class Provider extends Component {
  state = {
    client: null,
  };

  componentDidMount() {
    createClient({
      restoreCache: false,
      persistorStorage: new MockAsyncStorage(),
      terminatingLink: createSchemaLink(this.props),
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

export default ({
  typeDefs,
  mocks,
  resolvers,
  dataStore = {},
}) => story => (
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
