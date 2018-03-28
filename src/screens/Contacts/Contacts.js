import { debounce } from 'lodash';
import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import { FlatList } from "react-native";
import { NetworkStatus } from 'apollo-client';
import {
  Container,
  Content,
  Icon,
  View,
} from 'native-base';

import UserList from './UserList';
import SearchBar from './SearchBar';

export default class Contacts extends PureComponent {
  static navigationOptions = {
    title: 'Users',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={{ color: tintColor, fontSize: 35 }}
        name={'ios-people-outline'}
      />
    ),
  };

  state =  {
    searchPhrase: '',
  };

  onSearch(searchPhrase) {
    console.log('on search');
    this.setState({
      searchPhrase,
    });
  }

  render() {
    const { searchPhrase } = this.state;

    return (
      <Container>
        <SearchBar onSearch={::this.onSearch}/>
        <UserList search={searchPhrase} />
      </Container>
    );
  }
}
