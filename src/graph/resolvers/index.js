import { merge } from 'lodash';

import counter from './counter';

const { resolvers = {}, defaults = {}, typeDefs = [] } = merge(
  counter,
);

export default {
  resolvers,
  defaults,
  typeDefs,
};
