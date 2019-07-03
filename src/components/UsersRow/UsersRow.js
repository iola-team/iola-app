import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';
import { FlatList } from 'react-native';

import { withStyle } from '~theme';

import UsersRowItem from '../UsersRowItem';
import NoContent from '../NoContent';

const edgeFragment = gql`
  fragment UsersRow_edge on Edge {
    node {
      id
      ...UsersRowItem_user
    }
  }
  
  ${UsersRowItem.fragments.user}
`;

@withStyle('Sparkle.UsersRow', {
  height: 70,
})
export default class UsersRow extends PureComponent {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
    onItemPress: PropTypes.func,
    loading: PropTypes.bool,
    noContentText: PropTypes.string,
  };

  static defaultProps = {
    onItemPress: () => {},
    loading: false,
    edges: null,
    noContentText: undefined,
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
      noContentText,
      contentContainerStyle,
      ...listProps
    } = this.props;

    const isLoaded = edges !== null;
    const data = loading && !isLoaded ? this.getPlaceholders(5) : edges;

    return (
      <FlatList
        {...listProps}

        horizontal
        contentContainerStyle={[contentContainerStyle, { flexGrow: 1 }]}
        showsHorizontalScrollIndicator={false}

        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}

        ListEmptyComponent={(
          <NoContent text={noContentText === undefined ? 'No users' : noContentText} />
        )}
      />
    );
  }
}
