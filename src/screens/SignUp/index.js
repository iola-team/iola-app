import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './SignUp';

const withTokenMutation = graphql(gql`
  mutation($token: String!) {
      storeAuthToken(token: $token) @client
  }
`, {
  props: ({ mutate }) => ({
    storeToken: token => mutate({ variables: { token } })
  }),
});

const withSignUpMutation = graphql(gql`
  mutation($input: SignUpUserInput!) {
    result: signUpUser(input: $input) {
      accessToken
      user {
        id
        name
        email
        activityTime
      }
    }
  }
`, {
  props: ({ mutate, ownProps: { storeToken } }) => ({
    async create(name, email, password) {
      let success = false;

      try {
        const { data: { result } } = await mutate({
          variables: {
            input: {
              name,
              email,
              password,
            },
          },
        });

        await storeToken(result.accessToken);

        success = !!result.accessToken;
      } catch (error) {
        if (error.message.includes('Duplicate email')) alert('This email is already taken');
      }

      return success;
    },
  }),
});

export default compose(
  withTokenMutation,
  withSignUpMutation,
)(Screen);
