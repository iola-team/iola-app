import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getCounter, incrementCounter } from '../../store';
import LaunchScreen from './LaunchScreen';

const mapStateToProps = createStructuredSelector({
  counter: getCounter
});

const mapDispatchToProps = {
  incrementCounter,
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);
