import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { withStyle } from '~theme';

@withStyle('Sparkle.Placeholder', {
  overflow: 'hidden',
})
export default class Placeholder extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    isActive: true,
  };

  render() {
    const { isActive, ...props } = this.props;

    return !isActive
      ? <View {...props} />
      : (
        <Animatable.View
          {...props}
          useNativeDriver
          animation={{
            0: { opacity: 1 },
            0.5: { opacity: 0.3 },
            1: { opacity: 1 },
          }}

          duration={3000}
          iterationCount={Infinity}
        />
      );
  }
}
