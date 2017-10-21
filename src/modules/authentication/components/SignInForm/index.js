import { reduxForm } from 'redux-form';

import SignInForm from './SignInForm';

export const FORM_NAME = 'authentication/signIn';

export default reduxForm({
  form: FORM_NAME
})(SignInForm);