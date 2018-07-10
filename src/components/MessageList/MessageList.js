import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { SectionList } from 'react-native';
import { groupBy, orderBy, map } from 'lodash';

import { withStyle } from 'theme';
import MessageItem from '../MessageItem';
import SectionHeader from './SectionHeader';
import LoadIndicator from './LoadIndicator';

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
    loadingMore: PropTypes.bool,
  };

  static defaultProps = {
    loadingMore: false,
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
      time: new Date(time).toISOString(),
      data: edges,
    }));
  };

  getKeyForItem = item => item.node.id;

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
      <LoadIndicator />
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
      />
    );
  }
}
