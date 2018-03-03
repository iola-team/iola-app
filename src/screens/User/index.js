import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './User';

const withUser = graphql(gql`
  query getUsers {
    user: me {
      id
      name
      email
    }
  }
`);

export default withUser(Screen);
