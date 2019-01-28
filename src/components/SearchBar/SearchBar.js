import React, { PureComponent } from 'react';
import { Text, Item, ListItem, Input, Button } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce } from 'lodash';

import Icon from '../Icon';

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
  state = {
    phrase: '',
  };

  onSearch = debounce(this.props.setSearchBarValue, 200);

  onChange(phrase) {
    this.setState({ phrase });
    this.onSearch(phrase);
  }

  render() {
    const { phrase } = this.state;

    return (
      <ListItem searchBar noBorder>
        <Item>
          <Icon name="search" />
          <Input
            placeholder="Search for users"
            placeholderTextColor="#BDC0CB"
            value={phrase}
            onChangeText={::this.onChange}
          />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </ListItem>
    );
  }
}
