import React, { Component } from 'react';
import { Container } from 'native-base';

import TabBar from './TabBar';
import SceneView from './SceneView';

export default class TabNavigatorView extends Component {
  static defaultProps = {
    headerShrinkHeight: 0,
    renderHeader: () => null,
    renderTabs: props => <TabBar {...props} />,
    tabBarHeight: TabBar.HEIGHT,
  };

  state = {
    scrollOffset: 0,
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
    const { navigation: { state }, renderScene, headerShrinkHeight, tabBarHeight } = this.props;
    const { scrollOffset } = this.state;
    const commonProps = {
      /**
       * Data
       */
      scrollOffset,

      /**
       * Callbacks
       */
      onScrollEnd: this.onScrollEnd,
      renderTabs: this.renderTabs,
      renderHeader: this.renderHeader,
      renderScene,
      headerShrinkHeight,
      tabBarHeight,
    };

    return (
      <Container>
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
      </Container>
    );
  }
}
