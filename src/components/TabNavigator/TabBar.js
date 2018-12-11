import React, { Component } from 'react';
import { View as ViewRN } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import { TouchableOpacity } from 'components';

@withStyle('Sparkle.TabBar', {
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  paddingHorizontal: 20,

  'Sparkle.TouchableOpacity': {
    flex: 1,
    alignItems: 'center',

    'NativeBase.Text': {
      lineHeight: 45,
      borderBottomColor: 'transparent',
      borderBottomWidth: 2,
      paddingHorizontal: 10,
    },

    '.primary': {
      'NativeBase.Text': {
        borderBottomColor: '#5F96F2',
      },
    }
  }
})
export default class TabBar extends Component {
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
            </TouchableOpacity>
          ))
        }
      </ViewRN>
    );
  }
}