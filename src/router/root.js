import { findIndex } from 'lodash';
import modules from '../modules';

export default () => {
  const rootIndex = findIndex(modules, 'root');

  return modules[rootIndex].root;
};
