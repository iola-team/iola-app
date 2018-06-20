import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { SectionList } from 'react-native';
import { groupBy, map } from 'lodash';

import { withStyle } from 'theme';
import MessageItem from '../MessageItem';
import SectionHeader from './SectionHeader';

const edgeFragment = gql`
  fragment MessageList_edge on MessageEdge {
    cursor
    node {
      id
      ...MessageItem_message
    }
  }
  
  ${MessageItem.fragments.message}
`;

@withStyle('Sparkle.MessageList')
export default class MessageList extends PureComponent {
  static fragments = {
    edge: edgeFragment,
  }

  static propTypes = {
    edges: PropTypes.arrayOf(fragmentProp(edgeFragment).isRequired).isRequired,
    getItemSide: PropTypes.func.isRequired,
  };

  static defaultProps = {

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
  }

  getKeyForItem = item => item.node.id;

  renderItem = ({ item, index, section: { data: edges } }) => {
    const { getItemSide } = this.props;
    const { node } = item;
    const prevNode = index === 0 ? null : edges[index - 1] && edges[index - 1].node;
    const nextNode = edges[index + 1] && edges[index + 1].node;
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

  render() {
    const { style, edges } = this.props;
    const sections = this.splitToSections(edges);

    return (
      <SectionList
        style={style}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={this.renderSectionHeader}
        sections={sections}
        keyExtractor={this.getKeyForItem}
        renderItem={this.renderItem}
      />
    );
  }
}
