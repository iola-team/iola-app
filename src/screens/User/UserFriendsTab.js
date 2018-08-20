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
    const { navigation } = this.props;
    const id = navigation.state.params.id;

    return (
      <Tab
        {...this.props}
        scrollComponent={FriendList}
        userId={id}
      />
    );
  }
}
