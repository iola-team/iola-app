import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';
import { isFunction, isUndefined, noop } from 'lodash';

import { withStyleSheet as styleSheet } from 'theme';
import LoadMoreIndicator from '../LoadMoreIndicator';
import UserOnlineStatus from '../UserOnlineStatus';
import UserAvatar from '../UserAvatar';
import NoComments from './NoComments';

const edgeFragment = gql`
  fragment ImageCommentsList_edge on CommentEdge {
    cursor
    node {
      ...on Comment {
        id
        text
        createdAt
        user {
          ...on User {
            id
            name
            avatar {
              ...on Avatar {
                id
                url
              }
            }
          }
        }
      }
    }
  }
`;

// @TODO: remove
// const photoCommentsQuery = gql`
//   query photoCommentsQuery($id: ID!, $cursor: Cursor) {
//     photo: node(id: $id) {
//       ...on Photo {
//         id
//         comments(first: 10 after: $cursor) {
// #          totalCount
//           edges {
//             cursor
//             node {
//               id
//               text
//               createdAt
//               user {
//                 id
//                 name
//                 avatar {
//                   id
//                   url
//                 }
//               }
//             }
//           }
//           pageInfo {
//             hasNextPage
//             endCursor
//           }
//         }
//       }
//     }
//   }
// `;

@styleSheet('Sparkle.ImageCommentsList', {
  container: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  avatar: {
    marginRight: 8,
  },

  content: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // @TODO: box-shadow
    shadowColor: '#E1E6ED',
    shadowRadius: 4,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    marginRight: 8,
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#45474F',
  },

  text: {
    paddingVertical: 6,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#45474F',
  },

  createdAt: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 16,
    color: '#BDC0CB',
  },
})
export default class ImageCommentsList extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    onItemPress: PropTypes.func,
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment),
    ),
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static fragments = {
    edge: edgeFragment,
  };

  extractItemKey({ node }) {
    return node.id;
  }

  renderItem({ item: { node } }) {
    const { styleSheet: styles } = this.props;
    const { id, text, createdAt, user } = node;
    const date = moment.duration(moment(createdAt).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;
    const isOnline = true; // @TODO

    return (
      <View style={styles.container}>
        <UserAvatar user={user} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <UserOnlineStatus isOnline={isOnline} />
          </View>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.createdAt}>{dateFormatted}</Text>
        </View>
      </View>
    );
  }

  renderLoadIndicator = () => {
    return this.props.hasMore ? (
      <LoadMoreIndicator />
    ) : null;
  };

  render() {
    const { height, edges, ...listProps } = this.props;

    return edges.length ? (
      <FlatList
        {...listProps}
        data={edges}
        keyExtractor={::this.extractItemKey}
        renderItem={::this.renderItem}
        ListFooterComponent={this.renderLoadIndicator}
      />
    ) : (
      <NoComments height={height} />
    );
  }
}
