import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Launch from './Launch';

const withData = graphql(gql`
  query {
    me {
      id
      name
    }
  }
`, {
  options: {
    fetchPolicy: 'no-cache',
  },
});

export default compose(
  withData,
)(Launch);
