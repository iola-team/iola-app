import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import { withStyle } from '~theme';

const priorityMap = {
  'low': FastImage.priority.low,
  'normal': FastImage.priority.normal,
  'high': FastImage.priority.high,
};

@withStyle('Sparkle.Image')
export default class Image extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    priority: PropTypes.oneOf(['low', 'normal', 'high']),
  };

  static defaultProps = {
    priority: 'normal',
  };

  render() {
    const { source, priority, ...props } = this.props;

    const prioritySource = {
      ...source,
      priority: priorityMap[priority],
    };

    return <FastImage source={prioritySource} {...props} />;
  }
}