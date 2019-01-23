import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { range, uniqueId } from 'lodash';
import { View } from 'react-native';

import { withStyleSheet } from 'theme';
import { FlatList, NoContent } from '../TabNavigator';
import Item from '../PhotoListItem';
import TouchableOpacity from '../TouchableOpacity';

const edgeFragment = gql`
  fragment PhotoList_edge on PhotoEdge {
    node {
      id
      ...PhotoListItem_photo
    }
  }

  ${Item.fragments.photo}
`;

const createOptimisticEdge = ({ id, url }) => ({
  __typename: 'PhotoEdge',
  node: {
    id: uniqueId('OptimisticPhoto:'),
    ...Item.createOptimisticPhoto({ id, url }),
  },
});

@withStyleSheet('Sparkle.PhotoList', {
  item: {
    width: '33.33333333%',
    padding: 4,
  },
})
export default class PhotoList extends Component {
  static createOptimisticEdge = createOptimisticEdge;
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
    loading: PropTypes.bool,
    onItemPress: PropTypes.func,
    noContentText: PropTypes.string,
    noContentStyle: PropTypes.object,
    renderItem: PropTypes.func,
    itemsProgress: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
    onItemPress: () => null,
    noContentText: null,
    noContentStyle: null,
    renderItem: (params, render) => render(params),
    itemsProgress: {},
  };

  extractItemKey = ({ node, key }) => key || node.id;

  defaultRenderItem = ({ item, index }) => {
    const { styleSheet, onItemPress, itemsProgress } = this.props;
    const { node } = item;
    const progress = node && itemsProgress[node.id];

    return progress !== undefined || !node ? (
      <View style={styleSheet.item}>
        <Item photo={node} progress={progress} />
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => onItemPress({ item, index })}
        style={styleSheet.item}
      >
        <Item photo={node} />
      </TouchableOpacity>
    );
  };

  renderItem = (params) => {
    const { renderItem } = this.props;

    return renderItem(params, this.defaultRenderItem);
  };

  getPlaceholders() {
    return range(9).map(index => ({
      key: index.toString(),
    }));
  }

  render() {
    const {
      edges,
      loading,
      noContentText,
      noContentStyle,
      itemsProgress,
      ...listProps
    } = this.props;
    const data = loading ? this.getPlaceholders() : edges;

    return (
      <FlatList
        {...listProps}

        extraData={itemsProgress}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
        numColumns={3}
        data={data}
        ListEmptyComponent={(
          <NoContent style={noContentStyle} text={noContentText} icon="photos-empty-state" />
        )}
      />
    );
  }
}
