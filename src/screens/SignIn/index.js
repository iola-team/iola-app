import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './SignIn';

const withTokenMutation = graphql(gql`
  mutation($token: String!) {
    storeAuthToken(token: $token) @client
  }
`, {
  props: ({ mutate }) => ({
    storeToken: token => mutate({ variables: { token } })
  }),
});

const withLoginMutation = graphql(gql`
  mutation($login: String!, $password: String!) {
    result: signInUser(login: $login, password: $password) {
      accessToken
    }
  }
`, {
  props: ({ mutate, ownProps: { storeToken } }) => ({
    async authenticate(login, password) {
      const { data: { result } } = await mutate({
        variables: {
          login,
          password,
        },
      });

      await storeToken(result.accessToken);

      return !!result.accessToken;
    }
  }),
});

export default compose(
  withTokenMutation,
  withLoginMutation,
)(Screen);
