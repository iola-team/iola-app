import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Launch from './Launch';

const query = graphql(gql`
  query {
    counter { 
      count @client
    }
  }
`, {
  props: ({ data }) => ({
    count: data.counter.count,
  }),
});
const mutation = graphql(gql`
  mutation increment($by: Int) {
    incrementCounter(by: $by) @client
  }
`, {
  props: ({ mutate }) => ({
    increment: (by = 1) => mutate({ variables: { by } }),
  }),
});

export default compose(
  query,
  mutation,
)(Launch);
