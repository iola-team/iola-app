import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { USER } from '../routeNames';
import MyFriendsConnection from './MyFriendsConnection';
import TabBarLabel from './TabBarLabel';

@withStyleSheet('Sparkle.MyFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
@withNavigationFocus
export default class MyFriends extends Component {
  static navigationOptions = {
    tabBarLabel: () => <TabBarLabel />,
  };

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate(USER, { id });
  };

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { styleSheet: styles } = this.props;

    return (
      <MyFriendsConnection 
        contentContainerStyle={styles.list} 
        onItemPress={this.onItemPress}
      />
    );
  }
}
