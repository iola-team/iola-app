import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { View, Text, Button } from 'native-base';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
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

@styleSheet('iola.ImageCommentsList', {
  systemMessage: {
    alignItems: 'center',
    justifyContnet: 'center',
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 16,
  },

  systemMessageText: {
    color: '#F95356',
    textAlign: 'center',
  },

  unblockButton: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
})
export default class ImageCommentsList extends Component {
  static propTypes = {
    onItemPress: PropTypes.func,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired,
    ),
    loading: PropTypes.bool.isRequired,
    subscribeToNewComments: PropTypes.func.isRequired,
    listRef: PropTypes.object.isRequired,
    isBlockedForMe: PropTypes.bool.isRequired,
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

  renderSystemMessage = () => {
    const { isBlockedForMe, styleSheet: styles } = this.props;

    return (
      <View style={styles.systemMessage}>
        {isBlockedForMe ? (
          <Text style={styles.systemMessageText}>
            This user chooses not
            {'\n'}
            to interact with you
          </Text>
        ) : null}
      </View>
    );
  };

  render() {
    const { edges, loading, listRef, ...listProps } = this.props;
    const data = edges.length ? edges : (loading ? this.getPlaceholders() : edges);
    const emptyStateText = 'No comments yet\nBe the first to comment'; // For \n symbol work keep the text in the var

    return (
      <FlatList
        {...listProps}
        ref={listRef}
        data={data}
        keyExtractor={this.extractItemKey}
        renderItem={this.renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15 }}
        inverted={loading || edges.length}
        ListEmptyComponent={<NoContent icon="comments-empty-state" text={emptyStateText} inverted />}
        ListHeaderComponent={this.renderSystemMessage}
        removeClippedSubviews // "Sometimes image doesn't show (only Android)" issue: https://github.com/facebook/react-native/issues/17096
      />
    );
  }
}
