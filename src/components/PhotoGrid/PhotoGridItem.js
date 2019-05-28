import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { withStyle } from '~theme';

@withStyle('Sparkle.PhotoGridItem', {
  flex: 1,
  overflow: 'hidden',
  borderRadius: 8,
  margin: 4,

  '.placeholder': {
    borderWidth: 1,
    borderColor: '#AFB2BF',
    borderStyle: 'dashed',
  },
})
export default class PhotoGridItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.any,
  };

  render() {
    const { style, children } = this.props;

    return (
      <View style={style}>
        {children}
      </View>
    );
  }
}
