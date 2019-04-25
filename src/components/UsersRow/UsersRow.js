import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';
import { FlatList } from 'react-native';

import { withStyle } from '~theme';

import UsersRowItem from '../UsersRowItem';

const edgeFragment = gql`
  fragment UsersRow_edge on Edge {
    node {
      id
      ...UsersRowItem_user
    }
  }
  
  ${UsersRowItem.fragments.user}
`;

@withStyle('Sparkle.UsersRow')
export default class UsersRow extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
    onItemPress: PropTypes.func,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    onItemPress: () => {},
    loading: false,
    edges: null,
  };

  extractItemKey = ({ node, key }) => key || node.id;

  renderItem = ({ item }) => {
    const { onItemPress } = this.props;
    const { node } = item;

    return (
      <UsersRowItem
        user={node}
        onPress={() => onItemPress(item)}
      />
    );
  };

  getPlaceholders = count => range(count).map(index => ({
    key: index.toString(),
  }));

  render() {
    const {
      edges,
      loading,
      ...listProps
    } = this.props;

    const isLoaded = edges !== null;
    const data = loading && !isLoaded ? this.getPlaceholders(5) : edges;

    return (
      <FlatList
        {...listProps}

        horizontal
        showsHorizontalScrollIndicator={false}

        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
      />
    );
  }
}
