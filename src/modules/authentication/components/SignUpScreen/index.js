import { connect } from 'react-redux';
import { submit } from 'redux-form'

import SignInScreen from './SignUpScreen';
import { FORM_NAME } from '../SignUpForm';

import {} from '../../ducks'

const mapDispatchToProps = {
  submitForm: () => submit(FORM_NAME)
};

export default connect(null, mapDispatchToProps)(SignInScreen);