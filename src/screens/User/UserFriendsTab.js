import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';

import { FriendList } from 'components';
import Tab from './Tab';

export default class UserFriendsTab extends Component {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { navigation, ...props } = this.props;
    const id = navigation.state.params.id;

    return (
      <Tab
        {...props}
        scrollComponent={FriendList}
        userId={id}
      />
    );
  }
}
