import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Launch from './Launch';

const withMe = graphql(gql`
  query {
    me {
      id
    }
  }
`);

export default compose(
  withMe,
)(Launch);
