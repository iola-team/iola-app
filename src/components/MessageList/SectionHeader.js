import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import Placeholder from '../Placeholder';

@withStyle('Sparkle.MessageListSectionHeader', {
  'Sparkle.Placeholder': {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,

    'NativeBase.Text': {
      fontSize: 12,
      color: '#AFB2BF'
    },
  },
})
export default class SectionHeader extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    time: null,
    loading: false,
  };

  render() {
    const { style, time, loading } = this.props;

    return (
      <Placeholder style={style} isActive={loading}>
        {loading ? <Text>Loading...</Text> : <Moment element={Text} format="MMM D">{time}</Moment>}
      </Placeholder>
    );
  }
}
