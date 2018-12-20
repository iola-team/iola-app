import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { range } from 'lodash';
import { View } from 'react-native';

import { withStyleSheet } from 'theme';
import { FlatList, NoContent } from '../TabNavigator';
import Item from '../PhotoListItem';
import ImageView from '../ImageView';
import TouchableOpacity from '../TouchableOpacity';

const edgeFragment = gql`
  fragment PhotoList_edge on PhotoEdge {
    node {
      id
      ...PhotoListItem_photo
#// RR
#user {
#  id
#  name
#}
    }
  }

  ${Item.fragments.photo}
`;

@withStyleSheet('Sparkle.PhotoList', {
  item: {
    width: '33.33333333%',
    padding: 4,
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
    loading: PropTypes.bool,
    noContentText: PropTypes.string,
    noContentStyle: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
    noContentText: null,
    noContentStyle: null,
  };

  extractItemKey = ({ node, key }) => key || node.id;

  renderItem = ({ item: { node, opacity }, index }, onShowImage) => {
    const { styleSheet } = this.props;
    const opacityStyle = opacity && { opacity };

    return (
      <TouchableOpacity onPress={() => onShowImage(index)} style={[opacityStyle, styleSheet.item]}>
        <Item photo={node} />
      </TouchableOpacity>
    );
  };

  getPlaceholders() {
    return range(9).map(index => ({
      key: index.toString(),
      opacity: 1 - Math.floor(index / 3) * 0.3,
    }));
  }

  render() {
    const {
      edges,
      styleSheet: styles,
      loading,
      noContentText,
      noContentStyle,
      ...listProps
    } = this.props;

    const data = loading ? this.getPlaceholders() : edges;
    const photos = loading ? [] : edges.map(edge => edge.node);

    return (
      <ImageView images={photos}>
        {onShowImage => (
          <FlatList
            {...listProps}
            numColumns={3}
            data={data}
            renderItem={edge => this.renderItem(edge, onShowImage)}
            keyExtractor={this.extractItemKey}
            ListEmptyComponent={<NoContent style={noContentStyle} icon="images" text={noContentText} />}
          />
        )}
      </ImageView>
    );
  }
}
