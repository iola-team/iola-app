import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { FlatList, Image } from "react-native";

import { withStyleSheet } from 'theme';

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

  item: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
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

  extractItemKey({ node }) {
    return node.id;
  }

  renderItem({ item: { node } }) {
    const { styleSheet } = this.props;

    return (
      <Image style={styleSheet.item} source={{ uri: node.url }} />
    );
  }

  render() {
    const { edges, styleSheet, ...listProps } = this.props;

    return (
      <FlatList
        {...listProps}
        contentContainerStyle={styleSheet.list}
        numColumns={3}
        data={edges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
      />
    );
  }
}
