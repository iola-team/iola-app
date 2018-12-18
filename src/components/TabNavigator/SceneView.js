import React, { PureComponent, Component, createContext } from 'react';
import { StyleSheet, View, Platform, Animated, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { without } from 'lodash';

import BaseNoContent from '../NoContent';

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
    const { 
      renderHeader, 
      scrollAnimatedValue, 
      shrinkAnimatedValue, 
      shrinkAnimationHeight 
    } = this.context;

    return renderHeader({
      ...this.props,
      scrollAnimatedValue,
      shrinkAnimatedValue,
      shrinkAnimationHeight,
    });
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
    return this.context.renderTabs(this.props);
  }
}

export class NoContent extends Component {
  static contextType = Context;

  render() {
    if (!this.context) {
      return <BaseNoContent {...this.props} />;
    }

    const { shrinkAnimatedValue, shrinkAnimationHeight, contentHeight } = this.context;
    const { style, ...props } = this.props;
    const animatedStyle = {
      transform: [
        { 
          translateY: shrinkAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -shrinkAnimationHeight / 2],
          }),
        },
      ],
    };

    const iconScale = shrinkAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1 - (shrinkAnimationHeight / contentHeight / 1.5).toFixed(2)],
    });

    return <BaseNoContent {...props} style={[style, animatedStyle]} iconScale={iconScale} />;
  }
}

export default class SceneView extends PureComponent {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    scrollOffset: PropTypes.number,
    route: PropTypes.object.isRequired,
    renderScene: PropTypes.func.isRequired,
    headerHeight: PropTypes.number.isRequired,
    tabBarHeight: PropTypes.number.isRequired,
    headerShrinkHeight: PropTypes.number,
  };

  static defaultProps = {
    scrollOffset: 0,
    headerShrinkHeight: 0,
  };

  subscribers = {
    focus: [],
    scroll: [],
    layout: [],
  };

  contextValue = {};
  scrollAnimatedValue = new Animated.Value(0);
  onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: this.scrollAnimatedValue,
          },
        },
      },
    ],
    { 
      useNativeDriver: true,
    },
  );

  constructor(...args) {
    super(...args);

    this.contextValue = this.createContext();
  }

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

  createContext() {
    const { headerShrinkHeight, tabBarHeight, headerHeight, ...restProps } = this.props;

    const screenHeight = Dimensions.get('window').height - getStatusBarHeight();
    const shrinkAnimationHeight = headerHeight ? headerHeight - headerShrinkHeight : 0;
    const shrinkAnimatedValue = this.scrollAnimatedValue.interpolate({
      inputRange: [0, shrinkAnimationHeight],
      outputRange: [1, 0],
    });

    return {
      ...restProps,

      // Values
      headerHeight,
      tabBarHeight,
      headerShrinkHeight,
      shrinkAnimatedValue,
      shrinkAnimationHeight,
      contentHeight: screenHeight - tabBarHeight - headerShrinkHeight,
      scrollAnimatedValue: this.scrollAnimatedValue,

      // Handlers
      addListener: this.addListener,
      onScroll: this.onScroll,
    };
  }

  render() {
    const { isFocused, route, renderScene } = this.props;

    return (
      <Context.Provider value={this.contextValue}>
        <View
          style={styles.container}
          collapsable={false}
          removeClippedSubviews={
            // On iOS, set removeClippedSubviews to true only when not focused
            // This is an workaround for a bug where the clipped view never re-appears
            Platform.OS === 'ios' ? !isFocused : true
          }
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