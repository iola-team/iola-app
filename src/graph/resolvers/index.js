import { composeResovers } from '../utils';

// Resolvers
import auth from './auth';
import searchHistory from './searchHistory';

export default composeResovers(
  auth,
  searchHistory,
);
