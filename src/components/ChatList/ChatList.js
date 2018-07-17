import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View, Text, Button } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

/**
 * Component fragment sample
 */
const edgeFragment = gql`
  fragment ChatList_edge on ChatEdge {
    node {
      id
    }
  }
`;

@styleSheet('Sparkle.ChatList', {

})
export default class ChatList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
  };

  static defaultProps = {

  };

  render() {
    const { style, edges } = this.props;

    console.log('Edges', edges);

    return (
      <View style={style}>
        <Text>Hello Chats!!!</Text>
      </View>
    );
  }
}
