import { composeResovers } from '../utils'

// Resolvers
import counter from './counter';

export default composeResovers(
  counter
);
