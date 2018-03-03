import { composeResovers } from '../utils'

// Resolvers
import counter from './counter';
import auth from './auth';

export default composeResovers(
  counter,
  auth
);
