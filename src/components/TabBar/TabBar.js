import React, { Component, isValidElement } from 'react';
import { isFunction } from 'lodash';
import { View as ViewRN } from 'react-native';
import { Text, View } from 'native-base';

import { withStyle } from '~theme';
import TouchableOpacity from '../TouchableOpacity';

@withStyle('Sparkle.TabBar', {
  flexDirection: 'row',
  height: 50,
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingHorizontal: 50,

  'Sparkle.TouchableOpacity': {
    flex: 1,
    alignItems: 'center',

    'NativeBase.ViewNB': {
      '.label': {
        height: 45,
        justifyContent: 'center',
        borderBottomColor: 'transparent',
        borderBottomWidth: 2,
        paddingHorizontal: 5,
      },
    },

    '.primary': {
      'NativeBase.ViewNB': {
        '.indicator': {
          alignSelf: 'stretch',
          marginBottom: -1,
          backgroundColor: '#5259FF',
          height: 1,
        },

        'NativeBase.Text': {
          fontWeight: '600',
          color: '#5259FF',
        },

        'Sparkle.TabBarLabel': {
          'NativeBase.Text': {
            fontWeight: '600',
            color: '#5259FF',
          },
        },
      },
    }
  }
})
export default class TabBar extends Component {
  static HEIGHT = 50;

  renderTab = (route, index) => {
    const { onTabPress, getLabelText, navigation: { state } } = this.props;
    const focused = state.index === index;
    const labelGetter = getLabelText({ route });
    const label = isFunction(labelGetter) ? labelGetter({ focused }) : labelGetter;
    const labelElement = isValidElement(label) ? label : (
      <Text>{label}</Text>
    );

    return (
      <TouchableOpacity
        key={route.key}
        primary={focused}
        onPress={() => onTabPress({ route })}
      >
        <View label>
          {labelElement}
        </View>
        <View indicator />
      </TouchableOpacity>
    );
  };

  render() {
    const { style, navigation: { state } } = this.props;

    return (
      <ViewRN style={style}>
        {state.routes.map(this.renderTab)}
      </ViewRN>
    );
  }
}