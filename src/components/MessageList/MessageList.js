import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View } from 'native-base';
import { FlatList } from 'react-native';

import MessageItem from '../MessageItem';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

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

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.MessageList', {
  root: {

  }
})
export default class MessageList extends PureComponent {
  static fragments = {
    edge: edgeFragment,
  }

  static propTypes = {
    edges: PropTypes.arrayOf(fragmentProp(edgeFragment).isRequired).isRequired,
  };

  static defaultProps = {

  };

  renderItem = ({ item }) => {
    const { node } = item;

    return (
      <MessageItem message={node} />
    );
  }

  getKeyForItem = item => item.node.id;

  render() {
    const { style, edges } = this.props;

    return (
      <Root style={style}>
        <FlatList
          data={edges}
          keyExtractor={this.getKeyForItem}
          renderItem={this.renderItem}
        />
      </Root>
    );
  }
}
