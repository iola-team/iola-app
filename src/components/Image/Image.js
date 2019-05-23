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
    source: PropTypes.oneOfType([
      PropTypes.number, // local image
      PropTypes.object, // remote image
    ]).isRequired,
    priority: PropTypes.oneOf(['low', 'normal', 'high']),
  };

  static defaultProps = {
    priority: 'normal',
  };

  render() {
    const { source, priority, ...props } = this.props;
    const imageSource = typeof source === 'object' ? { priority: priorityMap[priority], ...source } : source;

    return <FastImage source={imageSource} {...props} />;
  }
}