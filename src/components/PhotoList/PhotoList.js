import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Image } from "react-native";

import { withStyleSheet } from 'theme';
import { FlatList } from '../TabNavigator';

const edgeFragment = gql`
  fragment PhotoList_edge on PhotoEdge {
    node {
      id
      url
    }
  }
`;

@withStyleSheet('Sparkle.PhotoList', {
  list: {

  },

  row: {

  },

  item: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
  },
})
export default class PhotoList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
  };

  extractItemKey = ({ node }) => node.id;

  renderItem = ({ item: { node } }) => {
    const { styleSheet } = this.props;

    return (
      <Image style={styleSheet.item} source={{ uri: node.url }} />
    );
  }

  render() {
    const {
      edges,
      styleSheet,
      contentContainerStyle,
      columnWrapperStyle,
      ...listProps
    } = this.props;

    return (
      <FlatList
        {...listProps}
        contentContainerStyle={[contentContainerStyle, styleSheet.list]}
        columnWrapperStyle={[columnWrapperStyle, styleSheet.row]}
        numColumns={3}
        data={edges}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
      />
    );
  }
}
