import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from 'native-base';

import TabBar from './TabBar';
import SceneView from './SceneView';
import { Provider } from './Context';

export default class TabNavigatorView extends Component {
  static defaultProps = {
    renderHeader: () => null,
  };

  renderTabs = () => <TabBar {...this.props} />;

  renderScene = (route, index) => {
    const { renderScene, navigation: { state } } = this.props;

    return (
      <SceneView 
        key={route.key}
        route={route}
        isFocused={state.index === index}
        renderScene={renderScene}
        renderHeader={this.renderHeader}
        renderTabs={this.renderTabs}
      />
    );
  }

  render() {
    const { 
      navigation,
      renderHeader = this.renderHeader,
    } = this.props;

    return (
      <Provider
        navigation={navigation}
        renderTabs={this.renderTabs}
        renderHeader={renderHeader}
      >
        <Container>
          {
            navigation.state.routes.map(this.renderScene)
          }
        </Container>
      </Provider>
    );
  }
}
