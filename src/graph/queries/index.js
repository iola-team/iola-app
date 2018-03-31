import gql from 'graphql-tag';

export const ROOT_QUERY = gql`
  query ApplicationQuery($isAuthenticated: Boolean!) {
    me @include(if: $isAuthenticated) {
      id
      name
      email
    }
  }
`;
