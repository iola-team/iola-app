import React, { PureComponent } from 'react';
import { Animated, View as ViewRN, StyleSheet } from 'react-native';
import { ScrollView as ScrollViewRN } from 'react-native-gesture-handler';
import { View } from 'native-base';

import RefreshControl from '../RefreshControl';
import { TabBar, Header, Context } from './SceneView';
import BarBackgroundView from '../BarBackgroundView';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollViewRN);

/**
 * TODO: Refactor this entire class. Most of the taken approaches require review.
 */
class ScrollView extends PureComponent {
  static contextType = Context;
  static defaultProps = {
    contentInset: { top: 0, bottom: 0 },
  };

  unsubscribe = [];
  scrollRef = null;
  state = {
    layout: null,
  };

  onRef = node => {
    this.scrollRef = node;
  }

  getNode() {
    if (this.scrollRef?.getScrollResponder) {
      return this.scrollRef.getScrollResponder();
    } 

    if (this.scrollRef?.getNode) {
      return this.scrollRef.getNode();
    }

    return this.scrollRef;
  }

  setNativeProps = (...args) => this.getNode().setNativeProps(...args);
  onLayout = (...args) => {
    const { onLayout } = this.props;
    const [{ nativeEvent: { layout } }] = args;

    this.setState({ layout });

    return onLayout && onLayout(...args);
  }

  onScrollEnd = ({ nativeEvent: { contentOffset } }) => {
    const { onScrollEnd, headerHeight } = this.context;
    const y = contentOffset.y > headerHeight ? headerHeight : contentOffset.y;
    
    onScrollEnd(y);
  }

  onRefresh = () => {
    const { onRefresh } = this.props;

    onRefresh();

    if (this.context) {
      this.context.refetch();
    }
  };

  componentDidMount() {
    if (this.context) {
      const { top } = this.getContentInset();
      const { scrollAnimatedValue } = this.context;

      scrollAnimatedValue.setValue(-top);
    }

    this.unsubscribe = !this.context ? [] : [
      this.context.addListener('scroll', (y, animated = false) => {
        this.getNode().scrollTo({ y, animated });
      }),
    ];
  }

  componentWillUnmount() {
    this.unsubscribe.map(unsub => unsub());
  }

  getContentInset() {
    const { contentInset, inverted } = this.props;

    return inverted 
      ? { ...contentInset, top: contentInset.bottom, bottom: contentInset.top }
      : contentInset;
  }

  getContentMinHeight() {
    const { layout } = this.state;
    const { top, bottom } = this.getContentInset();

    return layout && layout.height - top - bottom;
  }

  renderRefreshControl() {
    const { refreshControl, refreshing, onRefresh } = this.props;

    if (refreshControl) {
      return refreshControl;
    }

    return onRefresh && (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }
  
  render() {
    const { layout } = this.state;
    const { contentContainerStyle = {}, ...restProps } = this.props;
    const refreshControl = this.renderRefreshControl();
    const contentInset = this.getContentInset();
    const contentOffset = { y: -contentInset.top };

    if (!this.context) {
      return (
        <ScrollViewRN
          ref={this.onRef}
          {...restProps}

          onLayout={this.onLayout}
          contentContainerStyle={[contentContainerStyle, {
            minHeight: this.getContentMinHeight(),
            opacity: layout ? 1 : 0,
          }]}
          contentOffset={contentOffset}
          contentInset={contentInset}
          refreshControl={refreshControl}
        />
      );
    }

    const {
      scrollAnimatedValue,
      headerShrinkHeight,
      headerHeight,
      contentHeight,
      onScroll: onScrollEvent,
      bottomBarHeight,
    } = this.context;

    const {
      onScroll,
      children,
      ...listProps
    } = restProps;

    if (onScroll) {
      Animated.forkEvent(onScrollEvent, onScroll);
    }

    const topOffset = headerHeight && headerHeight - headerShrinkHeight;

    /**
     * Use big number for scroll height to not calculate it and rerender component
     * But it is ugly
     * 
     * TODO: Fix this someday
     */
    const scrollHeight = 1000000000;
    const stickyStyle = {
      zIndex: 1,
      transform: [
        {
          translateY: scrollAnimatedValue.interpolate({
            inputRange: [topOffset, scrollHeight + topOffset],
            outputRange: [0, scrollHeight],
            extrapolate: 'clamp',
          })
        }
      ],
    };

    return (
      <AnimatedScrollView
        ref={this.onRef}

        {...listProps}
        onScroll={onScrollEvent}
        onScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEnd}
        onMomentumScrollEnd={this.onScrollEnd}
        refreshControl={refreshControl}

        contentOffset={contentOffset}
        contentInset={{ ...contentInset, bottom: bottomBarHeight }}

        scrollEventThrottle={1}
      >
        <Animated.View style={stickyStyle}>
          <View style={{ marginTop: -contentHeight, paddingTop: contentHeight }}>
            <BarBackgroundView style={StyleSheet.absoluteFill} />
            <Header />
            <TabBar />
          </View>
        </Animated.View>

        <ViewRN style={[contentContainerStyle, { minHeight: contentHeight }]}>
          {children}
        </ViewRN>

      </AnimatedScrollView>
    );
  }
}

export const renderScrollComponent = props => <ScrollView {...props} />;
export default ScrollView;