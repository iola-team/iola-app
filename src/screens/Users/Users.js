import React, { PureComponent } from 'react';
import { Container } from 'native-base';
import { debounce } from 'lodash';

import { Icon, SearchBar } from 'components';
import { USER } from '../routeNames';
import UsersConnection from './UsersConnection';

export default class Users extends PureComponent {
  static navigationOptions = {
    title: 'Users',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="dashboard-bar" style={{ color: tintColor, fontSize: 25 }} />
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
