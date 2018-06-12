import { debounce } from 'lodash';
import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import { FlatList } from "react-native";
import { NetworkStatus } from 'apollo-client';
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Icon,
  View,
} from 'native-base';

import { SearchBar } from 'components';
import { USER } from '../roteNames';
import UsersConnection from './UsersConnection';
import * as routes from '../roteNames'

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
    this.setState({
      searchPhrase,
    });
  }

  onItemPress({ node }) {
    const { navigation: { navigate } } = this.props;

    navigate({ routeName: USER, params: { id: node.id }, key: node.id });
  }

  render() {
    const { searchPhrase } = this.state;

    return (
      <Container>
        <SearchBar onSearch={::this.onSearch} />
        <UsersConnection search={searchPhrase} onItemPress={::this.onItemPress} />
      </Container>
    );
  }
}
