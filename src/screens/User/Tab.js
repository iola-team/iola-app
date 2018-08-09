import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import { withNavigationFocus } from 'react-navigation';

@withNavigationFocus
export default class UserFriendsTab extends Component {
  scrollView = null;

  componentDidUpdate(prev) {
    const { isFocused, screenProps: { contentOffset } } = this.props;

    if (!isFocused && prev.screenProps.contentOffset !== contentOffset) {
      this.syncOffset();
    }
  }

  syncOffset() {
    const { screenProps: { contentOffset } } = this.props;

    if (!this.scrollView) {
      return;
    }

    this.scrollView.scrollTo({
      ...contentOffset,
      animated: false,
    });
  }

  onScrollMount = (node) => {
    this.scrollView = node;
    setTimeout(() => this.syncOffset());
  };

  render() {
    const {
      children,
      screenProps: {
        onScroll,
        contentOffset,
        header,
      },
      scrollComponent: Scroll = ScrollView
    } = this.props;

    return (
      <Scroll
        contentOffset={contentOffset}
        onScroll={onScroll}
        ref={this.onScrollMount}
        contentContainerStyle={{ minHeight: 1000 }}
      >
        {header}
        {children}
      </Scroll>
    );
  }
}
