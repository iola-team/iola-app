import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './SignUp';

const withSignUpMutation = graphql(gql`
  mutation($input: signUpUserInput!) {
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
    async submit(name, login, password) {
      try {
            const { data: { result } } = await mutate({
              variables: {
                input: {
                  name,
                  login,
                  password,
                },
              },
            });
alert(result.accessToken);
            await storeToken(result.accessToken);
            // @TODO: store result.user?
          } catch(error) {
alert(2);
          }

          return !!result.accessToken;
    },
  }),
});

export default compose(
  withSignUpMutation,
)(Screen);
