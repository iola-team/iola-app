import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Launch from './Launch';

const query = graphql(gql`
  query {
    counter @client
  }
`)

const mutation = graphql(gql`
  mutation {
    incrementCounter @client
  }
`, { name: 'increment' });

export default compose(
  query,
  mutation,
)(Launch);
