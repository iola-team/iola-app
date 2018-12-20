import React, { Component } from 'react';
import { View as ViewRN } from 'react-native';
import { Text, View } from 'native-base';

import { withStyle } from 'theme';
import TouchableOpacity from '../TouchableOpacity';

@withStyle('Sparkle.TabBar', {
  backgroundColor: '#F8F9FB',
  flexDirection: 'row',
  height: 60,
  alignItems: 'flex-end',
  justifyContent: 'center',

  'Sparkle.TouchableOpacity': {
    alignItems: 'center',
    paddingHorizontal: 15,

    'NativeBase.Text': {
      lineHeight: 45,
      borderBottomColor: 'transparent',
      borderBottomWidth: 2,
      paddingHorizontal: 5,
    },

    '.primary': {
      'NativeBase.ViewNB': {
        alignSelf: 'stretch',
        marginBottom: -1,
        backgroundColor: '#5259FF',
        height: 1,
      },
    }
  }
})
export default class TabBar extends Component {
  static HEIGHT = 60;

  render() {
    const { style, onTabPress, getLabelText, navigation: { state } } = this.props;

    return (
      <ViewRN style={style}>
        {
          state.routes.map((route, index) => (
            <TouchableOpacity
              key={route.key}
              primary={state.index === index}
              onPress={() => onTabPress({ route })}
            >
              <Text>{getLabelText({ route })}</Text>
              <View />
            </TouchableOpacity>
          ))
        }
      </ViewRN>
    );
  }
}