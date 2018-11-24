import React, { Component } from 'react';
import { View as ViewRN } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import { TouchableOpacity } from 'components';

@withStyle('Sparkle.TabBar', {
  flexDirection: 'row',
  paddingHorizontal: 20,
  backgroundColor: '#FFFFFF',

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
  renderTab = (route, index) => {
    const {
      onTabPress,
      getLabelText, 
      navigation: { state },
    } = this.props;

    return (
      <TouchableOpacity 
        key={route.key} 
        primary={state.index === index}
        onPress={() => onTabPress({ route })}
      >
        <Text>{getLabelText({ route })}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { style, navigation: { state } } = this.props;

    return (
      <ViewRN style={style}>
        {
          state.routes.map(this.renderTab)
        }
      </ViewRN>
    );
  }
}