import { connect } from 'react-redux';
import { submit, isSubmitting } from 'redux-form'
import { graphql, gql } from 'react-apollo';
import { property } from 'lodash';
import { createStructuredSelector } from 'reselect';

import SignInScreen from './SignInScreen';
import { FORM_NAME } from '../SignInForm';

import { showSignUp } from '../../ducks'
import { openMessenger } from '../../../application/ducks'

const signInMutation = gql`
mutation signIn($email: String!, $password: String!) {
  signinUser(email: {email: $email, password: $password}) {
    user {
      id
    }
  }
}
`;

const SignInWithData = graphql(signInMutation, {
  props: ({ mutate, ownProps: { openMessenger } }) => {
    return ({
      attemptLogin: ({ login, password }) => (
        mutate({
          variables: {
            email: login,
            password,
          }
        })
          .then(property('data.signinUser.user'))
          .then(openMessenger)
      )
    })
  }
})(SignInScreen);

const mapStateToProps = createStructuredSelector({
  isSubmitting: isSubmitting(FORM_NAME)
});

const mapDispatchToProps = {
  openMessenger,
  showSignUp,
  submitForm: () => submit(FORM_NAME)
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInWithData);