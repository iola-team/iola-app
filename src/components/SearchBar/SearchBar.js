import React, { PureComponent } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { Text, Item, ListItem, Input, Button } from 'native-base';

import Icon from '../Icon';

export default class SearchBar extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
  };

  state = {
    phrase: '',
  };

  onSearch = debounce(this.props.onSearch, 200);

  onPhraseChange(phrase) {
    this.setState({
      phrase,
    });

    this.onSearch(phrase);
  }

  render() {
    const { phrase } = this.state;

    return (
      <ListItem searchBar noBorder>
        <Item>
          <Icon name="search" />
          <Input
            placeholder="Search for contacts"
            placeholderTextColor="#BDC0CB"
            value={phrase}
            onChangeText={::this.onPhraseChange}
          />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </ListItem>
    );
  }
}
