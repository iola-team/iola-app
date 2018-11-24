import React, { PureComponent, Component, createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { without } from 'lodash';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container
const Context = createContext();

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

class Subscriber extends Component {
  static contextType = Context;
  unsubscribe = null;

  componentDidMount() {
    this.unsubscribe = this.context.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export class Header extends Subscriber {
  static contextType = Context;

  render() {
    return this.context.renderHeader();
  }
}

export class TabBar extends Subscriber {
  static contextType = Context;

  render() {
    return this.context.renderTabs();
  }
}

export default class SceneView extends PureComponent {
  subscribers = [];
  contextValue = null;

  subscribe = (subscriber) => {
    this.subscribers.push(subscriber);

    return () => without(this.subscribers, subscriber);
  }

  componentDidUpdate(prevProps) {
    const { isFocused } = this.props;

    if (isFocused !== prevProps.isFocused && isFocused) {
      this.subscribers.map(sub => sub());
    }
  }

  getContext() {
    const { renderHeader, renderTabs } = this.props;

    this.contextValue = this.contextValue || {
      subscribe: this.subscribe,
      renderHeader: (...args) => renderHeader(...args),
      renderTabs: (...args) => renderTabs(...args),
    };

    return this.contextValue;
  };

  render() {
    const { isFocused, route, renderHeader, renderTabs, renderScene } = this.props;

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