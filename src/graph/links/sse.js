import { ApolloLink, Observable } from 'apollo-link';
import { print } from 'graphql/language/printer';
import URL from 'url-parse';
import { isString, isObject, trim, isEmpty, without, memoize, find, isEqual } from 'lodash';

const addPathPart = (url, parts) => {
  const urlObject = new URL(url);
  const path = urlObject.pathname.split('/');
  urlObject.pathname = [
    '',
    ...path.filter(trim),
    ...parts,
  ].join('/')

  return urlObject.toString();
}

const printQuery = memoize(print);

export class SubscriptionClient {
  constructor({ uri, streamId, fetchImpl, EventSourceImpl }) {
    this.uri = addPathPart(uri, [streamId]);
    this.fetch = fetchImpl || ((...args) => fetch(...args));
    this.EventSource = EventSourceImpl || EventSource;

    this.eventSource = null;
    this.subscriptions = {};
  }

  get started() {
    return !!this.eventSource;
  }

  async request(uri, method, body) {
    const res = await this.fetch(uri.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      timeout: 1000,
    });

    return res.json();
  }

  onMessage = (event) => {
    const { data, type, subscriptionId } = JSON.parse(event.data);

    if (type === 'SUBSCRIPTION_DATA' && this.subscriptions[subscriptionId]) {
      console.log('Data', data.onMessageAdd.edge.node.content.text);
      this.subscriptions[subscriptionId].handlers.forEach(handler => handler(data));
    }
  };

  onError = (error) => {
    /**
     * Restart if not connecting
     */
    if (this.eventSource.readyState !== 0) {
      this.restart();
    }
  };

  async getSubscription(operation) {
    const subscription = find(this.subscriptions, ({ query, variables }) => (
      query === operation.query && isEqual(variables, operation.variables)
    ));

    if (subscription) {
      return subscription;
    }

    const { subscriptionId } = await this.request(this.uri, 'POST', operation);
    this.subscriptions[subscriptionId] = this.subscriptions[subscriptionId] || {
      subscriptionId,
      query: operation.query,
      variables: operation.variables,
      handlers: [],
    };

    return this.subscriptions[subscriptionId];
  }

  async start() {
    this.eventSource = new this.EventSource(this.uri);

    await new Promise((resolve, reject) => {
      this.eventSource.addEventListener('open', () => resolve(this.eventSource));
      this.eventSource.addEventListener('error', reject);
    });

    this.eventSource.addEventListener('message', this.onMessage);
    this.eventSource.addEventListener('error', this.onError);

    return this;
  }

  async stop() {
    if (!this.started) {
      return;
    }

    this.eventSource.close();
    this.eventSource = null;
  }

  async restart() {
    await this.stop();

    if (!isEmpty(this.subscriptions)) {
      return this.start();
    }
  }

  async subscribe(operation, handler) {
    const { query, variables, operationName } = operation;

    if (!query) {
      throw new Error('Must provide `query` to subscribe.');
    }

    if (!handler) {
      throw new Error('Must provide `handler` to subscribe.');
    }

    if (
      (operationName && !isString(operationName)) ||
      (variables && !isObject(variables))
    ) {
      throw new Error(
        'Incorrect option types to subscribe. `operationName` must be a string, and `variables` must be an object.'
      );
    }

    const { subscriptionId, handlers } = await this.getSubscription(operation);

    handlers.push(handler);

    await this.restart();

    return subscriptionId;
  }

  async unsubscribe(subscriptionId, handler) {
    const subId = await Promise.resolve(subscriptionId);
    const subscription = this.subscriptions[subId];

    if (!subscription) {
      return;
    }

    subscription.handlers = without(subscription.handlers, handler);

    if (subscription.handlers.length) {
      return;
    }

    delete this.subscriptions[subId];

    await this.request(addPathPart(this.uri, [subId]), 'DELETE');
    await this.restart();
  }

  async unsubscribeAll() {
    await this.stop();
    this.subscriptions = {};

    await this.request(this.uri, 'DELETE');
  }
}

export default class Sse extends ApolloLink {
  constructor(options) {
    super();

    this.subscriptionClient = new SubscriptionClient(options);
  }

  request(opertaion) {
    return new Observable(observer => {
      const handler = data => observer.next({ data });
      const subscriptionId = this.subscriptionClient.subscribe(
        {
          ...opertaion,
          query: printQuery(opertaion.query),
        },
        handler,
      );

      return () => this.subscriptionClient.unsubscribe(subscriptionId, handler);
    });
  }
}
