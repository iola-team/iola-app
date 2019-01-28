import { composeResovers } from '../utils';

// Resolvers
import auth from './auth';
import searchBar from './searchBar';

export default composeResovers(
  auth,
  searchBar,
);
