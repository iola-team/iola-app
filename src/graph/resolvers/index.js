import { composeResovers } from '../utils';

// Resolvers
import auth from './auth';

export default composeResovers(
  auth
);
