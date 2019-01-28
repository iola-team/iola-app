import React, { PureComponent } from 'react';
import { Text, Item, ListItem, Input, Button } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Icon from '../Icon';

@graphql(gql`
  query searchBarValueQuery {
    searchBarValue @client
  }
`)
@graphql(gql`
  mutation($value: String!) {
    setSearchBarValue(value: $value) @client
  }
`, {
  props: ({ mutate }) => ({
    setSearchBarValue: value => mutate({ variables: { value } }),
  }),
})
export default class SearchBar extends PureComponent {
  render() {
    const { data: { searchBarValue }, setSearchBarValue } = this.props;

    return (
      <ListItem searchBar noBorder>
        <Item>
          <Icon name="search" />
          <Input
            placeholder="Search for users"
            placeholderTextColor="#BDC0CB"
            value={searchBarValue}
            onChangeText={setSearchBarValue}
          />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </ListItem>
    );
  }
}
