import React, { PureComponent, Component, createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { without } from 'lodash';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  attached: {
    flex: 1,
  },
  detached: {
    flex: 1,
    left: FAR_FAR_AWAY,
  },
});

export const Context = createContext();

export class Header extends Component {
  static contextType = Context;

  render() {
    return this.context.renderHeader();
  }
}

export class TabBar extends Component {
  static contextType = Context;
  unsubscribe = null;

  componentDidMount() {
    this.unsubscribe = this.context.addListener('focus', () => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.context.renderTabs();
  }
}

export default class SceneView extends PureComponent {
  subscribers = {
    focus: [],
    scroll: [],
  };

  contextValue = null;

  addListener = (type, subscriber) => {
    this.subscribers[type].push(subscriber);

    return () => without(this.subscribers, subscriber);
  }

  componentDidUpdate(prevProps) {
    const { isFocused, scrollOffset } = this.props;

    if (isFocused !== prevProps.isFocused && isFocused) {
      this.subscribers.focus.map(sub => sub(isFocused));
      this.subscribers.scroll.map(sub => sub(scrollOffset));
    }
  }

  getContext() {
    const { renderHeader, renderTabs, onScrollEnd } = this.props;

    this.contextValue = this.contextValue || {
      addListener: this.addListener,
      onScrollEnd,
      renderHeader,
      renderTabs,
    };

    return this.contextValue;
  };

  render() {
    const { isFocused, route, renderScene } = this.props;

    return (
      <Context.Provider value={this.getContext()}>
        <View
          style={styles.container}
          collapsable={false}
          removeClippedSubviews
          pointerEvents={isFocused ? 'auto' : 'none'}
        >
          <View style={isFocused ? styles.attached : styles.detached}>
            {renderScene({ route })}
          </View>
        </View>
      </Context.Provider>
    );
  }
}