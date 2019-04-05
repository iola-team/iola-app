import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { filter } from 'lodash';

import ChatList from '../ChatList';
import MessageUpdateSubscription from '../MessageUpdateSubscription';

const chatsQuery = gql`
  query UserChatsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        chats {
          edges {
            node {
              id
              unreadMessages: messages(filter: {
                notReadBy: $userId
              }) {
                totalCount
              }
            }

            ...ChatList_edge
          }
        }
      }

      ...ChatList_user
    }
  }

  ${ChatList.fragments.user}
  ${ChatList.fragments.edge}
`;

const subscriptionQuery = gql`
  subscription UserChatsMessageAddSubscription($userId: ID!) {
    onMessageAdd(userId: $userId) {
      chatEdge {
        node {
          id
          unreadMessages: messages(filter: {
            notReadBy: $userId
          }) {
            totalCount
          }
        }

        ...ChatList_edge
      }
    }
  }

  ${ChatList.fragments.edge}
`;

@graphql(chatsQuery, {
  options: ({ userId }) => ({
    variables: {
      userId,
    },
  }),
  skip: props => !props.userId,
})
export default class UserChats extends Component {
  static propTypes = {
    userId: PropTypes.string,
  };

  static defaultProps = {
    userId: null,
  };

  unsubscribe = () => null;

  startSubscriptions() {
    const { data, userId } = this.props;

    if (!data) {
      return;
    }

    this.unsubscribe();
    this.unsubscribe = data.subscribeToMore({
      document: subscriptionQuery,
      variables: { userId },
      updateQuery(prev, { subscriptionData }) {
        if (!subscriptionData.data) {
          return prev;
        }

        const { chatEdge } = subscriptionData.data.onMessageAdd;
        return update(prev, {
          user: {
            chats: {
              edges: {
                $set: [
                  chatEdge,
                  ...filter(prev.user.chats.edges, ({ node }) => node.id !== chatEdge.node.id),
                ],
              },
            },
          },
        });
      },
    });
  }

  componentDidUpdate(prevProps) {
    const { userId } = this.props;

    if (prevProps.userId !== userId) {
      this.startSubscriptions();
    }
  }

  componentDidMount() {
    this.startSubscriptions();
  }

  render() {
    const { data, ...restProps } = this.props;
    const loading = !data || data.loading;
    const edges = data?.user?.chats.edges || [];
    const unreadCounts = edges.map(edge => edge.node.unreadMessages.totalCount);

    return (
      <>
        <ChatList
          {...restProps}
          loading={loading}
          user={data?.user}
          unreadCounts={unreadCounts}
          edges={data?.user?.chats.edges}
        />

        {data?.user && <MessageUpdateSubscription userId={data.user.id} />}
      </>
    );
  }
}
