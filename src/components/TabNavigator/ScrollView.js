import React, { PureComponent } from 'react';
import { ScrollView as ScrollViewRN, View } from 'react-native';

import { TabBar, Header, Context } from './SceneView';

export default class ScrollView extends PureComponent {
  static contextType = Context;
  unsubscribe = null;
  scrollRef = null;
  headerHeight = null;

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.scrollTo({ y, animated });
    }
  }

  onRef = (ref) => {
    this.scrollRef = ref;
  }

  onLayout = ({ nativeEvent: { layout } }) => {
    this.headerHeight = layout.height;
  };

  onMomentumScrollEnd = ({ nativeEvent: { contentOffset } }) => {
    if (contentOffset.y >= this.headerHeight) {
      return;
    }

    const y = contentOffset.y > (this.headerHeight / 2) ? this.headerHeight : 0;

    this.context.onScrollEnd(y);
    this.scrollTo(y, true);
  }

  componentDidMount() {
    this.unsubscribe = this.context.addListener('scroll', this.scrollTo);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  
  render() {
    const { children, ...props } = this.props;
    

    return (
      <ScrollViewRN 
        {...props}
        ref={this.onRef}
        stickyHeaderIndices={[1]}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
      >
        <View onLayout={this.onLayout}>
          <Header />
        </View>
        <TabBar />

        {children}
      </ScrollViewRN>
    );
  }
}