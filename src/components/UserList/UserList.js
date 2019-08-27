import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';

import { withStyleSheet } from '~theme';
import { FlatList, NoContent } from '../TabNavigator';
import UserListItem from '../UserListItem';

const edgeFragment = gql`
  fragment UserList_edge on Edge {
    node {
      id
      ...UserListItem_user
    }
  }
  
  ${UserListItem.fragments.user}
`;

@withStyleSheet('iola.UserList')
export default class UserList extends PureComponent {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ),
    onItemPress: PropTypes.func,
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    noContentText: PropTypes.string,
    noContentStyle: PropTypes.object,
  };

  static defaultProps = {
    onItemPress: () => {},
    loading: false,
    hasMore: false,
    edges: null,
    noContentText: undefined,
    noContentStyle: undefined,
  };

  extractItemKey = ({ node, key }) => key || node.id;

  renderItem = ({ item, index }) => {
    const { onItemPress, edges } = this.props;
    const { node } = item;

    return (
      <UserListItem
        user={node}
        last={(index + 1) === edges?.length}
        onPress={() => onItemPress(item)}
      />
    );
  };

  getPlaceholders = count => range(count).map(index => ({
    key: index.toString(),
  }));

  render() {
    const {
      edges,
      loading,
      hasMore,
      styleSheet: styles,
      noContentText,
      noContentStyle,
      renderItem = this.renderItem,
      ...listProps
    } = this.props;

    const isLoaded = edges !== null;
    const data = !isLoaded && loading ? this.getPlaceholders(3) : edges;

    return (
      <FlatList
        ListEmptyComponent={(
          <NoContent
            style={noContentStyle}
            icon="friends-empty-state"
            text={noContentText === undefined ? 'No users' : noContentText}
          />
        )}

        /**
         * Render load more placeholder
         */
        ListFooterComponent={!!edges?.length && hasMore && <UserListItem />}

        {...listProps}
        data={data}
        renderItem={renderItem}
        keyExtractor={this.extractItemKey}
      />
    );
  }
}
