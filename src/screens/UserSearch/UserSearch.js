import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { SearchBar } from 'components';

export default class UserSearch extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        autoFocus
        placeholder="Search users"
        value={navigation.getParam('search', '')}
        onChangeText={search => navigation.setParams({ search })}
      />
    ),
    headerStyle: {
      borderBottomWidth: 0,
    },
    headerTitleContainerStyle: {
      right: 16, // TODO: Move this value to theme somehow
    },
  });

  render() {
    const { navigation } = this.props;

    return (
      <View>
        <Text>Search screen: {navigation.getParam('search')}</Text>
      </View>
    );
  }
}