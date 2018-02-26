import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './User';

const withUser = graphql(gql`
  query getUsers {
    user(id: "User:449") {
      id
      name
      email
    }
  }
`);

export default withUser(Screen);
