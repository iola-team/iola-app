import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './SignUp';

const withSignUpMutation = graphql(gql`
  mutation($name: String!, $login: String!, $password: String!) {
    result: signUpUser($name: String!, $login: String!, $password: String!) {
      accessToken
    }
  }
`, {
  props: ({ mutate, ownProps: { storeToken } }) => ({
    async submit(name, login, password) {
      const { data: { result } } = await mutate({
        variables: {
          name,
          login,
          password,
        },
      });

      await storeToken(result.accessToken);

      return !!result.accessToken;
    },
  }),
});

export default compose(
  withSignUpMutation,
)(Screen);
