import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';

import ImageCommentsItem from '../ImageCommentsItem';
import NoContent from '../NoContent';

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
    onItemPress: PropTypes.func,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired,
    ),
    loading: PropTypes.bool.isRequired,
    subscribeToNewComments: PropTypes.func.isRequired,
    listRef: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static fragments = {
    edge: edgeFragment,
  };

  componentDidMount() {
    this.props.subscribeToNewComments();
  }

  shouldComponentUpdate(nextProps) {
    const { edges, loading } = this.props;

    return edges.length !== nextProps.edges.length || loading !== nextProps.loading;
  }

  extractItemKey = ({ node, key }) => key || node.id;

  getPlaceholders() {
    return range(3).map(index => ({
      key: `placeholder:${index}`,
      node: null,
    }));
  }

  renderItem({ item: { node } }) {
    return <ImageCommentsItem comment={node} />;
  }

  render() {
    const { edges, loading, listRef, ...listProps } = this.props;
    const data = loading && !edges.length ? this.getPlaceholders() : edges;
    const emptyStateText = 'No comments yet\nBe the first to comment';

    return (
      <FlatList
        {...listProps}
        ref={listRef}
        data={data}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={(
          <NoContent icon="comments-empty-state" text={emptyStateText} inverted />
        )}
        removeClippedSubviews // "Sometimes image doesn't show (only Android)" issue: https://github.com/facebook/react-native/issues/17096
      />
    );
  }
}
