import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import { withNavigationFocus } from 'react-navigation';

// @withNavigationFocus
export default class UserFriendsTab extends Component {
  scrollViewRef = React.createRef();

  // componentDidUpdate(prev) {
  //   const { isFocused, screenProps: { contentOffset } } = this.props;
  //
  //   if (!isFocused && prev.screenProps.contentOffset !== contentOffset) {
  //     this.syncOffset();
  //   }
  // }
  //
  // syncOffset() {
  //   const { screenProps: { contentOffset } } = this.props;
  //
  //   if (!this.scrollViewRef.current) {
  //     return;
  //   }
  //
  //   this.scrollViewRef.current.scrollTo({
  //     ...contentOffset,
  //     animated: false,
  //   });
  // }
  //
  // componentDidMount() {
  //   this.syncOffset();
  // }

  render() {
    const {
      children,
      screenProps: {
        onScroll,
        contentOffset,
        renderHeader,
      },
      scrollComponent: Scroll = ScrollView,
      contentContainerStyle,
      headerStyles,
      ...restProps
    } = this.props;

    const styledHeader = renderHeader({
      style: headerStyles,
    });

    return (
      <Scroll
        {...restProps}
        // ref={this.scrollViewRef}
        // contentOffset={contentOffset}
        // onScroll={onScroll}
        // contentContainerStyle={[contentContainerStyle, { minHeight: 1000 }]}
        ListHeaderComponent={styledHeader}
      >
        {styledHeader}
        {children}
      </Scroll>
    );
  }
}
