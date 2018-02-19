import { compose, withState } from 'recompose';

import Launch from './Launch';

const state = withState('counter', 'incrementCounter', 0);

export default compose(
  state,
)(Launch);
