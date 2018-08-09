import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from 'native-base';

import Tab from './Tab';

export default class UserInfoTab extends Component {
  static navigationOptions = {
    title: 'Info',
  };

  render() {
    return (
      <Tab {...this.props}>
        <Text>User info tab</Text>
      </Tab>
    );
  }
}
