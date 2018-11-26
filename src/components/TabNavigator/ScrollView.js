import React, { PureComponent } from 'react';
import { ScrollView as ScrollViewRN, View } from 'react-native';

import { TabBar, Header, Context } from './SceneView';

export default class ScrollView extends PureComponent {
  static contextType = Context;
  unsubscribe = null;
  scrollRef = null;

  state = {
    rootHeight: 0,
    headerHeight: 0,
  };

  scrollTo = (y, animated = false) => {
    if (this.scrollRef) {
      this.scrollRef.scrollTo({ y, animated });
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
    if (!this.context) {
      return <ScrollViewRN {...this.props} />;
    }

    const { rootHeight, headerHeight } = this.state;
    const { children, ...props } = this.props;

    return (
      <ScrollViewRN 
        {...props}
        ref={this.onRef}
        stickyHeaderIndices={[1]}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        contentContainerStyle={{
          minHeight: rootHeight + headerHeight,
        }}
        onLayout={this.onRootLayout}
      >
        <View onLayout={this.onHeaderLayout}>
          <Header />
        </View>
        <TabBar />

        {children}
      </ScrollViewRN>
    );
  }
}