import React, { Component } from 'react';
import { View as ViewRN } from 'react-native';
import { View, Text } from 'native-base';
import { map } from 'lodash';

import { withStyle } from 'theme';
import { TouchableOpacity } from 'components';

@withStyle('Sparkle.UserTabBar', {
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
  navigateToTab(key) {
    const { navigation: { navigate } } = this.props;

    setTimeout(() => navigate(key));
  }

  renderTab({ options, key }) {
    const { navigation: { state, navigate } } = this.props;
    const isActive = state.routes[state.index].key === key;

    return (
      <TouchableOpacity key={key} primary={isActive} onPress={() => this.navigateToTab(key)}>
        <Text>{options.title || key}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { style, descriptors } = this.props;

    return (
      <ViewRN style={style}>
        {
          map(descriptors, ::this.renderTab)
        }
      </ViewRN>
    );
  }
}
