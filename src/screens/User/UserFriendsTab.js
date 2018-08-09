import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';

import Tab from './Tab';

export default class UserFriendsTab extends Component {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    return (
      <Tab {...this.props}>
        <Text>User Friends tab</Text>
      </Tab>
    );
  }
}
