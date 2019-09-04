/* eslint max-classes-per-file: 0 */

import { ApolloLink, Observable } from 'apollo-link';
import { print } from 'graphql/language/printer';
import URL from 'url-parse';
import { isString, isObject, trim, without, memoize, find, isEqual, throttle } from 'lodash';

const addPathPart = (url, parts) => {
  const urlObject = new URL(url);
  const path = urlObject.pathname.split('/');
  urlObject.pathname = [
    '',
    ...path.filter(trim),
    ...parts,
  ].join('/');

  return urlObject.toString();
};

const printQuery = memoize(print);

export class SubscriptionClient {
  constructor({ uri, streamId, fetchImpl, EventSourceImpl }) {
    this.uri = addPathPart(uri, [streamId]);
    this.fetch = fetchImpl || ((...args) => fetch(...args));
    this.EventSource = EventSourceImpl || EventSource;
    this.lastEventId = null;

    this.eventSource = null;
    this.subscriptions = {};
    this.restartQueue = [];
  }

  get started() {
    return !!this.eventSource;
  }

  async request(uri, method, body, headers = {}) {
    const res = await this.fetch(uri.toString(), {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    });

    return res.json();
  }

  onMessage = (event) => {
    const { data, type, subscriptionId } = JSON.parse(event.data);
    this.lastEventId = event.lastEventId;

    if (type === 'SUBSCRIPTION_DATA' && this.subscriptions[subscriptionId]) {
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

  getSubscription(operation) {
    return find(this.subscriptions, ({ query, variables }) => (
      query === operation.query && isEqual(variables, operation.variables)
    ));
  }

  async createSubscription(operation, handlers = [], headers = {}) {
    const { subscriptionId } = await this.request(this.uri, 'POST', operation, headers);
    this.subscriptions[subscriptionId] = this.subscriptions[subscriptionId] || {
      subscriptionId,
      query: operation.query,
      variables: operation.variables,
      handlers: [],
    };

    const oldHandlers = this.subscriptions[subscriptionId].handlers;
    this.subscriptions[subscriptionId].handlers = [
      ...oldHandlers,
      ...handlers,
    ];

    return this.subscriptions[subscriptionId];
  }

  async start(lastEventId = null) {
    this.lastEventId = lastEventId;
    const headers = {};

    if (this.lastEventId) {
      headers['Last-Event-ID'] = this.lastEventId;
    }

    this.eventSource = new this.EventSource(this.uri, {
      headers,
    });

    await new Promise((resolve, reject) => {
      this.eventSource.addEventListener('open', () => resolve(this.eventSource));
      this.eventSource.addEventListener('error', reject);
    });

    this.eventSource.addEventListener('message', this.onMessage);
    this.eventSource.addEventListener('error', this.onError);

    return this;
  }

  async stop() {
    const lastEventId = this.lastEventId;
    this.lastEventId = null;

    if (!this.started) {
      return lastEventId;
    }

    this.eventSource.close();
    this.eventSource = null;

    return lastEventId;
  }


  scheduleRestart(promise) {
    this.restartQueue.push(promise);
    this.delayedRestart();
  };

  delayedRestart = throttle(() => {
    if (!this.restartQueue) {
      return;
    }

    const [ ...promises ] = this.restartQueue;
    this.restartQueue = [];

    Promise.all(promises).then(() => this.restart());
  }, 500, {
    leading: false,
    trailing: true,
  });

  async restart() {
    const lastEventId = await this.stop();

    if (Object.keys(this.subscriptions).length) {
      await this.start(lastEventId);
    }

    return this;
  }

  async subscribe(operation, handler, headers = {}) {
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

    let subscription = this.getSubscription(operation);

    if (!subscription) {
      const subscriptionPromise = this.createSubscription(operation, [ handler ], headers);
      this.scheduleRestart(subscriptionPromise);
      subscription = await subscriptionPromise;
    } else {
      subscription.handlers.push(handler);
    }

    return subscription.subscriptionId;
  }

  async unsubscribe(subscriptionId, handler, headers = {}) {
    const subscription = this.subscriptions[subscriptionId];

    if (!subscription) {
      return;
    }

    subscription.handlers = without(subscription.handlers, handler);

    if (subscription.handlers.length) {
      return;
    }

    delete this.subscriptions[subscriptionId];

    const sunscriptionUri = addPathPart(this.uri, [subscriptionId]);
    const deletePromise = this.request(sunscriptionUri, 'DELETE', null, headers);
    this.scheduleRestart(deletePromise);
    await deletePromise;
  }
}

export default class Sse extends ApolloLink {
  constructor(options) {
    super();

    this.subscriptionClient = new SubscriptionClient(options);
  }

  request(operation) {
    const { headers } = operation.getContext();

    return new Observable(observer => {
      const handler = data => observer.next({ data });
      const subscriptionPromise = this.subscriptionClient.subscribe(
        {
          ...operation,
          query: printQuery(operation.query),
        },
        handler,
        headers,
      );

      return () => subscriptionPromise.then(subscriptionId => (
        this.subscriptionClient.unsubscribe(subscriptionId, handler, headers)
      ));
    });
  }
}
