import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './SignUp';

const withSignUpMutation = graphql(gql`
  mutation($input: SignUpUserInput!) {
    result: signInUser(input: $input) {
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
// @TODO: store result.user?
      } catch(error) {
        alert(error.message);
      }

      return !!result.accessToken;
    },
  }),
});

export default compose(
  withSignUpMutation,
)(Screen);
