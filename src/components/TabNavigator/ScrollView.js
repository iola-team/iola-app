import React, { PureComponent } from 'react';
import { ScrollView as ScrollViewRN, Animated, View } from 'react-native';

import { TabBar, Header, Context } from './SceneView';

export default class ScrollView extends PureComponent {
  static contextType = Context;
  unsubscribe = null;
  scrollRef = null;
  scrollAnimatedValue = new Animated.Value(0);
  onScrollAnimatedEvent = Animated.event(
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

  state = {
    rootHeight: 0,
    headerHeight: 0,
  };

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.getNode().scrollTo({ y, animated });
    }
  }

  onRef = (ref) => {
    this.scrollRef = ref;
  }

  onHeaderLayout = ({ nativeEvent: { layout } }) => {
    this.setState({
      headerHeight: layout.height,
    });
  };

  onRootLayout = ({ nativeEvent: { layout } }) => {
    this.setState({
      rootHeight: layout.height,
    });
  };

  onMomentumScrollEnd = ({ nativeEvent: { contentOffset } }) => {
    const { headerHeight } = this.state;
    const { onScrollEnd } = this.context;
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

    const { onScroll, children, ...listProps } = restProps;
    const { headerShrinkHeight } = this.context; 
    const { rootHeight, headerHeight } = this.state;
    const marginTop = headerHeight && headerHeight - headerShrinkHeight;

    const headerAnimatedValue = this.scrollAnimatedValue.interpolate({
      inputRange: [0, marginTop],
      outputRange: [1, 0],
    });

    if (onScroll) {
      Animated.forkEvent(this.onScrollAnimatedEvent, onScroll);
    }

    return (
      <Animated.ScrollView 
        {...listProps}
        ref={this.onRef}
        onScroll={this.onScrollAnimatedEvent}
        stickyHeaderIndices={[0]}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        contentContainerStyle={{
          minHeight: rootHeight + marginTop,
        }}
        onLayout={this.onRootLayout}
      >
        <View style={{ marginTop }}>
          <View onLayout={this.onHeaderLayout} style={{ marginTop: -marginTop }}>
            <Header animatedValue={headerAnimatedValue} />
          </View>
          <TabBar />
        </View>

        <View style={contentStyle}>
          {children}
        </View>
      </Animated.ScrollView>
    );
  }
}