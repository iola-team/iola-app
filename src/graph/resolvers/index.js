import { merge } from 'lodash';

import counter from './counter';

const { resolvers = {}, defaults = {} } = merge(
  counter,
);

export default {
  resolvers,
  defaults,
}
