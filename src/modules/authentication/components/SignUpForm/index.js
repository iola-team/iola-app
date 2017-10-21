import { reduxForm } from 'redux-form';

import SignUpForm from './SignUpForm';

export const FORM_NAME = 'authentication/signUp';

export default reduxForm({
  form: FORM_NAME
})(SignUpForm);