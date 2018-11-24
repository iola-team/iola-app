import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import update from 'immutability-helper';

import { withStyleSheet } from 'theme';
import TabBar from './TabBar';
import { Provider } from './Context';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

@withStyleSheet('Sparkle.TabNavigatorView', {
  root: {
    flex: 1,
    overflow: 'hidden',
  },

  scene: {
    ...StyleSheet.absoluteFillObject,
    left: FAR_FAR_AWAY,
  },

  focused: {
    left: 0,
  },
})
export default class TabNavigatorView extends Component {
  state = {
    renderAll: false,
  };

  renderHeader = () => <Text>Grey Rabbit</Text>;

  renderTabs = () => <TabBar {...this.props} />;

  renderScene = (route, index) => {
    const { styleSheet, renderScene, navigation: { state } } = this.props;
    const { renderAll } = this.state;
    const focused = state.index === index;

    return (focused || renderAll) && (
      <View 
        key={route.key}
        style={[styleSheet.scene, focused && styleSheet.focused]}
      >
        {renderScene({ route })}
      </View>
    );
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      renderAll: true,
    }), 100);
  }

  render() {
    const { 
      style, 
      styleSheet, 
      navigation,
      renderHeader = this.renderHeader,
    } = this.props;

    return (
      <Provider
        navigation={navigation}
        renderTabs={this.renderTabs}
        renderHeader={renderHeader}
      >
        <View 
          style={[styleSheet.root, style]}
          removeClippedSubviews
          collapsable={false}
        >
          {
            navigation.state.routes.map(this.renderScene)
          }
        </View>
      </Provider>
    );
  }
}
