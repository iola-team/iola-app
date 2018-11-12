import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { SectionList } from 'react-native';
import { groupBy, orderBy, map, filter, get } from 'lodash';

import { withStyle } from 'theme';
import MessageItem from '../MessageItem';
import LoadMoreIndicator from '../LoadMoreIndicator';
import SectionHeader from './SectionHeader';

const edgeFragment = gql`
  fragment MessageList_edge on MessageEdge {
    node {
      id
      ...MessageItem_message
    }
  }
  
  ${MessageItem.fragments.message}
`;

@withStyle('Sparkle.MessageList')
export default class MessageList extends Component {
  static fragments = {
    edge: edgeFragment,
  }

  static propTypes = {
    edges: PropTypes.arrayOf(fragmentProp(edgeFragment).isRequired).isRequired,
    getItemSide: PropTypes.func.isRequired,
    onRead: PropTypes.func,
    loadingMore: PropTypes.bool,
  };

  static defaultProps = {
    loadingMore: false,
    onRead: () => {},
  };

  splitToSections(edges) {
    const grouped = groupBy(edges, ({ node }) => {
      const createdAt = new Date(node.createdAt);

      return [
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate(),
      ].join('/');
    });

    return map(grouped, (edges, time) => ({
      isSection: true,
      key: time.toString(),
      time: new Date(time).toISOString(),
      data: edges,
    }));
  };

  getKeyForItem = item => item.isSection ? item.key : item.node.id;
  onViewableItemsChanged = ({ changed }) => {
    const { onRead } = this.props;

    const filterRead = ({ isViewable, item }) => (
      isViewable && !item.isSection && item.node.status !== 'READ'
    );
    const nodes = changed.filter(filterRead).map(({ item }) => item.node);

    if (nodes.length) {
      onRead(nodes);
    }
  };

  renderItem = ({ item, index, section: { data: edges } }) => {
    const { getItemSide, inverted } = this.props;
    const dir = inverted === true ? -1 : 1;

    const { node } = item;
    const prevNode = edges[index - dir] && edges[index - dir].node;
    const nextNode = edges[index + dir] && edges[index + dir].node;
    const side = getItemSide(node);
    const last = !nextNode || getItemSide(nextNode) !== side;
    const first = !prevNode || getItemSide(prevNode) !== side;

    return (
      <MessageItem
        message={node}
        right={side === 'right'}
        left={side === 'left'}
        last={last}
        first={first}
        hasAvatar={side === 'left'}
      />
    );
  }

  renderSectionHeader = ({ section }) => (
    <SectionHeader time={section.time} />
  );

  renderLoadIndicator = () => {
    const { loadingMore } = this.props;

    return loadingMore && (
      <LoadMoreIndicator />
    );
  };

  render() {
    const { style, edges, inverted, ...listProps } = this.props;
    const sections = this.splitToSections(edges);

    const sectionProps = {
      [inverted ? 'renderSectionFooter' : 'renderSectionHeader']: this.renderSectionHeader,
    };

    return (
      <SectionList
        {...listProps}
        {...sectionProps}

        style={style}
        inverted={inverted}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={this.getKeyForItem}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderLoadIndicator}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}
