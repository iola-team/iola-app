import React, { Component } from 'react';
import { Container } from 'native-base';

import TabBar from './TabBar';
import SceneView from './SceneView';

export default class TabNavigatorView extends Component {
  static defaultProps = {
    renderHeader: () => null,
  };

  renderTabs = () => <TabBar {...this.props} />;

  render() {
    const { navigation: { state }, renderScene, renderHeader } = this.props;

    return (
      <Container>
        {
          state.routes.map((route, index) => (
            <SceneView 
              key={route.key}
              route={route}
              isFocused={state.index === index}
              renderTabs={this.renderTabs}

              renderScene={renderScene}
              renderHeader={renderHeader}
            />
          ))
        }
      </Container>
    );
  }
}
