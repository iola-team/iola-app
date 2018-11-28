import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

import LoadMoreIndicator from '../LoadMoreIndicator';
import ImageCommentsItem from '../ImageCommentsItem';
import NoComments from './NoComments';

const edgeFragment = gql`
  fragment ImageCommentsList_edge on CommentEdge {
    cursor
    node {
      ...ImageCommentsItemFragment
    }
  }

  ${ImageCommentsItem.fragments.comment}
`;

export default class ImageCommentsList extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    onItemPress: PropTypes.func,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static fragments = {
    edge: edgeFragment,
  };

  extractItemKey({ node }) {
    return node.id;
  }

  renderItem({ item: { node } }) {
    return <ImageCommentsItem comment={node} />;
  }

  renderLoadIndicator() {
    return this.props.hasMore ? <LoadMoreIndicator /> : null;
  };

  render() {
    const { height, edges, ...listProps } = this.props;

    return edges.length ? (
      <FlatList
        {...listProps}
        data={edges}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
        ListFooterComponent={::this.renderLoadIndicator}
      />
    ) : (
      <NoComments height={height} />
    );
  }
}
