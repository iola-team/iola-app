import React, { PureComponent, createRef } from 'react';
import { ScrollView as ScrollViewRN } from 'react-native';

import { TabBar, Header, Context } from './SceneView';

/**
 * TODO: Detect
 */
const headerHeight = 200;

export default class ScrollView extends PureComponent {
  static contextType = Context;
  unsubscribe = null;
  scrollRef = null;

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.scrollTo({ y, animated });
    }
  }

  onRef = (ref) => {
    this.scrollRef = ref;
  }

  onMomentumScrollEnd = ({ nativeEvent: { contentOffset } }) => {
    const { onScrollEnd } = this.context;
    const halfHeader = headerHeight / 2;

    if (contentOffset.y >= headerHeight) {
      return;
    }

    const y = contentOffset.y > halfHeader ? headerHeight : 0;

    onScrollEnd(y);
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
        <Header />
        <TabBar />

        {children}
      </ScrollViewRN>
    );
  }
}