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

const withSignInMutation = graphql(gql`
  mutation($input: SignInUserInput!) {
    result: signInUser(input: $input) {
      accessToken
    }
  }
`, {
  props: ({ mutate, ownProps: { storeToken } }) => ({
    async authenticate(login, password) {
      const { data } = await mutate({
        variables: {
          input: {
            login,
            password,
          },
        },
      });

      alert(JSON.stringify(data));

      await storeToken(data.result.accessToken);

      return !!data.result.accessToken;
    }
  }),
});

export default compose(
  withTokenMutation,
  withSignInMutation,
)(Screen);
