import React, { PureComponent } from 'react';
import { ScrollView as ScrollViewRN, Animated, View } from 'react-native';

import { TabBar, Header, Context } from './SceneView';

export default class ScrollView extends PureComponent {
  static contextType = Context;

  unsubscribe = null;
  scrollRef = null;

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.getNode().scrollTo({ y, animated });
    }
  }

  onRef = (ref) => {
    this.scrollRef = ref;
  }

  onMomentumScrollEnd = ({ nativeEvent: { contentOffset } }) => {
    const { onScrollEnd, headerHeight } = this.context;
    const y = contentOffset.y > headerHeight ? headerHeight : contentOffset.y;
    
    onScrollEnd(y);
  }

  componentDidMount() {
    if (this.context) {
      this.unsubscribe = this.context.addListener('scroll', this.scrollTo);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  
  render() {
    const { contentContainerStyle, ...restProps } = this.props;
    const contentStyle = [contentContainerStyle, { flexGrow: 1 }];

    if (!this.context) {
      return <ScrollViewRN contentContainerStyle={contentStyle} {...restProps} />;
    }

    const {
      scrollAnimatedValue,
      headerShrinkHeight,
      headerHeight,
      contentHeight,
      onScroll: onScrollEvent,
    } = this.context;

    const { onScroll, children, ...listProps } = restProps;
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
        onMomentumScrollEnd={this.onMomentumScrollEnd}

        scrollEventThrottle={1}
      >
        <Animated.View style={stickyStyle}>
          <Header />
          <TabBar />
        </Animated.View>

        <View style={[contentStyle, { minHeight: contentHeight }]}>
          {children}
        </View>

      </Animated.ScrollView>
    );
  }
}