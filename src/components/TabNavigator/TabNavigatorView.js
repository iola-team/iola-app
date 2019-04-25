import React, { Component } from 'react';
import { View } from 'react-native';

import TabBar from '../TabBar';
import SceneView from './SceneView';

export default class TabNavigatorView extends Component {
  static defaultProps = {
    renderHeader: () => null,
    renderTabs: props => <TabBar {...props} />,
    tabBarHeight: TabBar.HEIGHT,
  };

  state = {
    scrollOffset: null,
  };

  renderHeader = (props = {}) => {
    const { renderHeader, navigation } = this.props;

    return renderHeader({
      ...props,
      navigation,
    });
  };

  renderTabs = (props = {}) => {
    const { renderTabs, ...restProps } = this.props;

    return renderTabs({
      ...restProps,
      ...props,
    });
  };

  onScrollEnd = (scrollOffset) => this.setState({ scrollOffset });

  render() {
    const { navigation: { state }, ...restProps } = this.props;
    const { scrollOffset } = this.state;
    const commonProps = {
      ...restProps,
      scrollOffset,
      onScrollEnd: this.onScrollEnd,
      renderTabs: this.renderTabs,
      renderHeader: this.renderHeader,
    };

    return (
      <View style={{ flex: 1 }}>
        {
          state.routes.map((route, index) => (
            <SceneView 
              key={route.key}
              route={route}
              isFocused={state.index === index}

              {...commonProps}
            />
          ))
        }
      </View>
    );
  }
}
