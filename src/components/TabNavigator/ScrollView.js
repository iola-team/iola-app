import React, { PureComponent } from 'react';
import { Animated, View as ViewRN, StyleSheet } from 'react-native';
import { ScrollView as ScrollViewRN } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import { View } from 'native-base';

import RefreshControl from '../RefreshControl';
import { TabBar, Header, Context } from './SceneView';
import BarBackgroundView from '../BarBackgroundView';

@withNavigation
class ScrollView extends PureComponent {
  static contextType = Context;

  unsubscribe = [];
  scrollRef = null;

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.getNode().scrollTo({ y, animated });
    }
  }

  onRef = (ref) => {
    this.scrollRef = ref;
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
    this.unsubscribe = !this.context ? [] : [
      this.context.addListener('scroll', this.scrollTo),
    ];
  }

  componentWillUnmount() {
    this.unsubscribe.map(unsub => unsub());
  }

  getContentInset() {
    const { contentInset = {}, navigation, inverted } = this.props;
    const screenProps = navigation.getScreenProps();
    let inset = { ...screenProps.contentInset, ...contentInset };

    if (inverted) {
      inset = { ...inset, top: inset.bottom, bottom: inset.top };
    }

    return inset;
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
    const { contentContainerStyle = {}, ...restProps } = this.props;
    const refreshControl = this.renderRefreshControl();
    const contentInset = this.getContentInset();
    const contentOffset = { y: -contentInset.top };
    const contentStyle = [contentContainerStyle, {
      // flexGrow: 1, // TODO: Check no items cases before removing this line
    }];

    if (!this.context) {
      return (
        <ScrollViewRN
          contentContainerStyle={contentStyle}
          contentOffset={contentOffset}
          contentInset={contentInset}

          {...restProps}
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
      <Animated.ScrollView
        {...listProps}
        ref={this.onRef}
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

        <ViewRN style={[contentStyle, { minHeight: contentHeight }]}>
          {children}
        </ViewRN>

      </Animated.ScrollView>
    );
  }
}

export const renderScrollComponent = props => <ScrollView {...props} />;
export default ScrollView;
