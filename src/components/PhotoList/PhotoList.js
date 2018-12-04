import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { NetworkStatus } from 'apollo-client';
import { range } from 'lodash';

import { withStyleSheet } from 'theme';
import { FlatList } from '../TabNavigator';
import Item from '../PhotoListItem';

const edgeFragment = gql`
  fragment PhotoList_edge on PhotoEdge {
    node {
      id
      ...PhotoListItem_photo
    }
  }

  ${Item.fragments.photo}
`;

@withStyleSheet('Sparkle.PhotoList', {
  list: {

  },

  row: {

  },

  item: {
    flex: 1,
    margin: 4,
  },
})
export default class PhotoList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
    networkStatus: PropTypes.number,
  };

  static defaultProps = {
    networkStatus: NetworkStatus.ready,
  };

  extractItemKey = ({ node, key }) => key || node.id;
  renderItem = ({ item: { node, opacity } }) => {
    const { styleSheet } = this.props;
    const opacityStyle = opacity && { opacity };

    return <Item style={[opacityStyle, styleSheet.item]} photo={node} />;
  }

  getPlaceholders() {
    return range(9).map(index => ({ 
      key: index.toString(),
      opacity: 1 - Math.floor(index / 3) * 0.3,
    }));
  }

  render() {
    const {
      edges,
      styleSheet,
      networkStatus,
      contentContainerStyle,
      columnWrapperStyle,
      ...listProps
    } = this.props;

    const data = networkStatus === NetworkStatus.loading ? this.getPlaceholders() : edges;

    return (
      <FlatList
        {...listProps}
        contentContainerStyle={[contentContainerStyle, styleSheet.list]}
        columnWrapperStyle={[columnWrapperStyle, styleSheet.row]}
        numColumns={3}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
      />
    );
  }
}
