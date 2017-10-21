import { connect } from 'react-redux';
import LaunchScreen from './LaunchScreen';

import { startAuthentication, openMessenger } from '../../ducks'

const mapDispatchToProps = {
  startAuthentication,
  openMessenger
};

export default connect(null, mapDispatchToProps)(LaunchScreen);