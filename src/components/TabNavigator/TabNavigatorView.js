import React, { Component } from 'react';
import { Container } from 'native-base';

import TabBar from './TabBar';
import SceneView from './SceneView';

export default class TabNavigatorView extends Component {
  static defaultProps = {
    renderHeader: () => null,
  };

  state = {
    scrollOffset: 0,
  };

  renderTabs = () => <TabBar {...this.props} />;
  onScrollEnd = (scrollOffset) => this.setState({ scrollOffset });

  render() {
    const { 
      navigation: { state }, 
      renderScene, 
      renderHeader,
    } = this.props;

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
      renderScene,
      renderHeader,
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
