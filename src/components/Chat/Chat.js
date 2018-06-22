import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { NetworkStatus } from 'apollo-client';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import {
  View,
  Text,
  Button,
} from 'native-base';

import MessageList from '../MessageList';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const chatQuery = gql`
  query ChatQuery($id: ID! $first: Int $last: Int $after: Cursor $before: Cursor) {
    me {
      id
    }

    chat: node(id: $id) {
      id
      ...on Chat {
        messages(last: $last after: $after first: $first before: $before) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            ...MessageList_edge
          }
        }
      }
    }
  }
  
  ${MessageList.fragments.edge}
`;

@styleSheet('Sparkle.Chat')
@graphql(chatQuery, {
  props({ data }) {
    return {
      data,
      loadEarlierMessages() {
        const {
          networkStatus,
          fetchMore,
          chat: {
            messages: { pageInfo }
          }
        } = data;

        if (networkStatus === NetworkStatus.fetchMore || !pageInfo.hasNextPage) {
          return;
        }

        const variables = {
          after: pageInfo.endCursor,
        };

        return fetchMore({
          variables,
          updateQuery(prev, { fetchMoreResult: { chat } }) {
            return update(prev, {
              chat: {
                messages: {
                  edges: { $push: chat.messages.edges },
                  pageInfo: { $set: chat.messages.pageInfo },
                },
              },
            });
          },
        });
      },

      /**
       * TODO: Find a better way of loading new messages instead of full reload
       */
      loadNewMessages() {
        return data.refetch();
      }
    };
  },

  options({ chatId }) {
    return {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: chatId,
        first: 50,
      },
    };
  }
})
export default class Chat extends Component {
  static propTypes = {
    chatId: PropTypes.string.isRequired,
  };

  getItemSide = ({ user }) => this.props.data.me.id === user.id ? 'right' : 'left';

  render() {
    const {
      style,
      data: { networkStatus, chat },
      loadEarlierMessages,
      loadNewMessages
    } = this.props;

    const isReady = networkStatus !== NetworkStatus.loading;

    return (
      <View style={style}>
        {isReady && (
          <MessageList
            edges={chat.messages.edges}
            getItemSide={this.getItemSide}
            loadingMore={chat.messages.pageInfo.hasNextPage}

            inverted={true}
            initialNumToRender={15}
            onEndReachedThreshold={1}
            onEndReached={loadEarlierMessages}
            onRefresh={loadNewMessages}
            refreshing={networkStatus === NetworkStatus.refetch}
          />
        )}
      </View>
    );
  }
}
