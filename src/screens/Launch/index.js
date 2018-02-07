import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getCounter, incrementCounter } from '../../store';
import Launch from './Launch';

const mapStateToProps = createStructuredSelector({
  counter: getCounter
});

const mapDispatchToProps = {
  incrementCounter,
}

export default connect(mapStateToProps, mapDispatchToProps)(Launch);
