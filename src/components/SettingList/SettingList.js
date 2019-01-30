import React, { Component } from 'react';
import { Text } from 'native-base';

import { ScrollView } from '../TabNavigator';

export default class SettingList extends Component {
  render() {
    const { ...props } = this.props;

    return (
      <ScrollView {...props}>
        <Text>Settings List</Text>
      </ScrollView>
    );
  }
}
