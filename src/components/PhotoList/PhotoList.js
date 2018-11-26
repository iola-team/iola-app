import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { FlatList, Image } from 'react-native';

import { withStyleSheet } from 'theme';
import ImageView from '../ImageView';
import TouchableOpacity from '../TouchableOpacity';

const edgeFragment = gql`
  fragment PhotoList_edge on PhotoEdge {
    node {
      id
      url
      user {
        id
        name
      }
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

  extractItemKey({ node }) {
    return node.id;
  }

  renderItem({ item: { node }, index }, onShowImage) {
    const { styleSheet } = this.props;

    return (
      <TouchableOpacity style={styleSheet.item} onPress={() => onShowImage(index)}>
        <Image style={styleSheet.item} source={{ uri: node.url }} />
      </TouchableOpacity>
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

    const photos = edges.map(edge => ({ ...edge.node }));

    return (
      <ImageView images={photos}>
        {onShowImage => (
          <FlatList
            {...listProps}
            contentContainerStyle={[contentContainerStyle, styleSheet.list]}
            columnWrapperStyle={[columnWrapperStyle, styleSheet.row]}
            numColumns={3}
            data={edges}
            keyExtractor={::this.extractItemKey}
            renderItem={edge => this.renderItem(edge, onShowImage)}
          />
        )}
      </ImageView>
    );
  }
}
