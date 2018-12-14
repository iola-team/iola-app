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
      headerShrinkHeight, 
      headerHeight, 
      contentHeight,
      onScroll: onScrollEvent,
      shrinkAnimatedValue,
    } = this.context;

    const { onScroll, children, ...listProps } = restProps;
    const marginTop = headerHeight && headerHeight - headerShrinkHeight;

    if (onScroll) {
      Animated.forkEvent(onScrollEvent, onScroll);
    }

    return (
      <Animated.ScrollView
        {...listProps}
        ref={this.onRef}
        onScroll={onScrollEvent}
        stickyHeaderIndices={[0]}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
      >
        <View style={{ marginTop }}>
          <View style={{ marginTop: -marginTop }}>
            <Header animatedValue={shrinkAnimatedValue} />
          </View>
          <TabBar />
        </View>

        <View style={[contentStyle, { minHeight: contentHeight }]}>
          {children}
        </View>

      </Animated.ScrollView>
    );
  }
}