import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text, Badge } from 'native-base';

import { withStyle } from '~theme';
import Icon from '../Icon';

@withStyle('Sparkle.TabBarIcon', {
  fontSize: 25,
  alignItems: 'center',
  justifyContent: 'center',

  'NativeBase.Badge': {
    position: 'absolute',
    right: -12,
    top: -7,
    minWidth: 16,
    height: null,
    width: null,
    paddingHorizontal: 2,
    paddingVertical: 0,
    borderRadius: 8,

    'NativeBase.Text': {
      lineHeight: 16,
      fontSize: 9,
      fontWeight: 'bold',
    },
  },
})
export default class TabBarIcon extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    count: PropTypes.number,
    tintColor: PropTypes.string,
  };

  static defaultProps = {
    count: null,
    tintColor: undefined,
  };

  render() {
    const { count, name, tintColor, style, ...props } = this.props;
    const sanitizedCount = Math.max(count, 0);
    const { color: styleColor, fontSize, ...restStyle } = StyleSheet.flatten(style);
    const color = tintColor || styleColor;

    return (
      <View {...props} style={restStyle}>
        <Icon name={name} style={{ color, fontSize }} />

        {!!sanitizedCount && (
          <Badge>
            <Text numberOfLines={1} ellipsizeMode="clip">{sanitizedCount > 99 ? '99+' : sanitizedCount}</Text>
          </Badge>
        )}
      </View>
    );
  }
}
