import React, { PureComponent } from 'react';
import { Animated, View as ViewRN, StyleSheet, Platform } from 'react-native';
import { ScrollView as ScrollViewRN } from 'react-native-gesture-handler';
import { getInset } from 'react-native-safe-area-view';
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

      scrollAnimatedValue.setOffset(Platform.select({ ios: 0, default: -top }));
      scrollAnimatedValue.setValue(Platform.select({ ios: -top, default: 0 }));
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

  getScrollViewProps() {
    const refreshControl = this.renderRefreshControl();
    let contentInset = this.getContentInset();

    if (this.context) {
      const { bottomBarHeight } = this.context;

      contentInset = { ...contentInset, bottom: bottomBarHeight + getInset('bottom') };
    }

    const contentOffset = { y: -contentInset.top };

    return {
      refreshControl,

      ...Platform.select({
        ios: {
          contentInset,
          contentOffset,
        },

        default: {
          contentContainerStyle: {
            paddingTop: contentInset.top,
            paddingBottom: contentInset.bottom,
          },
        },
      })
    };
  }

  renderRefreshControl() {
    const { refreshControl, refreshing, onRefresh } = this.props;
    const { top } = this.getContentInset();

    if (refreshControl) {
      return refreshControl;
    }

    return onRefresh && (
      <RefreshControl progressViewOffset={top} refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }
  
  render() {
    const { layout } = this.state;
    const { contentContainerStyle = {}, ...restProps } = this.props;
    const scrollViewProps = this.getScrollViewProps();

    if (!this.context) {
      return (
        <ScrollViewRN
          ref={this.onRef}
          {...restProps}
          {...scrollViewProps}

          onLayout={this.onLayout}
          contentContainerStyle={[contentContainerStyle, {
            minHeight: this.getContentMinHeight(),
            opacity: layout ? 1 : 0,
          }, scrollViewProps.contentContainerStyle]}
        />
      );
    }

    const {
      scrollAnimatedValue,
      headerShrinkHeight,
      headerHeight,
      contentHeight,
      onScroll: onScrollEvent,
      tabBarHeight,
    } = this.context;

    const {
      onScroll,
      children,
      ...listProps
    } = restProps;

    if (onScroll) {
      Animated.forkEvent(onScrollEvent, onScroll);
    }

    const { top } = this.getContentInset();
    const topOffset = headerHeight && headerHeight - headerShrinkHeight;

    /**
     * Use big number for scroll height to not calculate it and rerender component
     * But it is ugly
     * 
     * TODO: Fix this someday
     */
    const scrollHeight = 1000000000;
    const stickyStyle = {
      ...StyleSheet.absoluteFillObject,
      bottom: null,
      top: Platform.select({ ios: 0, default: top }),

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
        {...scrollViewProps}

        onScroll={onScrollEvent}
        onScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEnd}
        onMomentumScrollEnd={this.onScrollEnd}

        scrollEventThrottle={1}
        removeClippedSubviews={false}
      >
        <ViewRN style={{ height: headerHeight + tabBarHeight }} />
        <ViewRN style={[contentContainerStyle, { minHeight: contentHeight }]}>
          {children}
        </ViewRN>

        <Animated.View style={stickyStyle}>
          <View style={{ marginTop: -contentHeight, paddingTop: contentHeight }}>
            <BarBackgroundView style={StyleSheet.absoluteFill} />
            <Header />
            <TabBar />
          </View>
        </Animated.View>
      </AnimatedScrollView>
    );
  }
}

export const renderScrollComponent = props => <ScrollView {...props} />;
export default ScrollView;