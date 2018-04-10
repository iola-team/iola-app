import { composeResovers } from '../utils'

// Resolvers
import auth from './auth';
import cache from './cache';

export default composeResovers(
  cache,
  auth
);
