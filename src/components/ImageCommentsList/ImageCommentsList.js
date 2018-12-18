import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

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
    edges: PropTypes.arrayOf(fragmentProp(edgeFragment)),
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static fragments = {
    edge: edgeFragment,
  };

  constructor(props) {
    super(props);

    this.flatList = null;
    this.scrollOffset = 0;
    this.itemsCount = 0;
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this); // Invariant Violation: Changing onViewableItemsChanged on the fly is not supported (also :: operator)
  }

  shouldComponentUpdate(nextProps) {
    const { edges, loading } = this.props;

    return edges.length !== nextProps.edges.length || loading !== nextProps.loading;
  }

  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      this.itemsCount = this.props.edges.length;
    }
  }

  onViewableItemsChanged() {
    const { edges } = this.props;

    if (this.itemsCount === edges.length) return;

    this.itemsCount = edges.length;

    if (this.flatList) {
      this.flatList.scrollToIndex({ animated: true, index: 0 });
    }
  }

  extractItemKey({ node }) {
    return node.id;
  }

  renderItem({ item: { node } }) {
    return <ImageCommentsItem comment={node} />;
  }

  render() {
    const { height, edges, loading, ...listProps } = this.props;

    return (
      <FlatList
        {...listProps}
        ref={ref => this.flatList = ref}
        data={edges}
        onViewableItemsChanged={this.onViewableItemsChanged}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
        ListEmptyComponent={<NoComments height={height} />}
      />
    );
  }
}
