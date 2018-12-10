import React, { PureComponent } from 'react';
import { Container, Icon } from 'native-base';
import { debounce } from 'lodash';

import { SearchBar } from 'components';
import { USER } from '../roteNames';
import UsersConnection from './UsersConnection';

export default class Users extends PureComponent {
  static navigationOptions = {
    title: 'Users',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="ios-people-outline" style={{ color: tintColor, fontSize: 35 }} />
    ),
  };

  state =  {
    searchPhrase: '',
  };

  onSearch = (searchPhrase) => {
    this.setState({
      searchPhrase,
    });
  }

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(USER, { id: node.id });
  }

  render() {
    const { searchPhrase } = this.state;

    return (
      <Container>
        <SearchBar onSearch={this.onSearch} />
        <UsersConnection search={searchPhrase} onItemPress={this.onItemPress} />
      </Container>
    );
  }
}
