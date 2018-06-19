import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { FlatList, View as ViewRN } from 'react-native';

import MessageItem from '../MessageItem';
import { withStyle } from 'theme';

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

@withStyle('Sparkle.MessageList', {
  'Sparkle.MessageItem': {
    marginBottom: 5,

    '.left': {
      alignSelf: 'flex-start',
    },

    '.right': {
      alignSelf: 'flex-end',
    },

    '.last': {
      marginBottom: 15,
    }
  },
})
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

  renderItem = ({ item, index }) => {
    const { getItemSide, edges } = this.props;
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
      />
    );
  }

  getKeyForItem = item => item.node.id;

  render() {
    const { style, edges } = this.props;

    return (
      <ViewRN style={style}>
        <FlatList
          data={edges}
          keyExtractor={this.getKeyForItem}
          renderItem={this.renderItem}
        />
      </ViewRN>
    );
  }
}
