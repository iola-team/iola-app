import counter, * as fromCounter from './counter';

export const getCounter = state => fromCounter.getCounter(state.counter);

export default {
  counter,
};
