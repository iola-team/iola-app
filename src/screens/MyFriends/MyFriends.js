import React, { PureComponent } from 'react';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import MyFriendsConnection from './MyFriendsConnection';

@withStyleSheet('Sparkle.MyFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
@withNavigationFocus
export default class MyFriends extends PureComponent {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { isFocused, styleSheet: styles } = this.props;

    return (
      <MyFriendsConnection contentContainerStyle={styles.list} skip={!isFocused} />
    );
  }
}
