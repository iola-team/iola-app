import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Contacts from './Contacts';

const withUsers = graphql(gql`
  query {
    users {
      id
      name
      activityTime
      avatar {
        id
        url
      }
    }
  }
`)

export default compose(
  withUsers,
)(Contacts);
